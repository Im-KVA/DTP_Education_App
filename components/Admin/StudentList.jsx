import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../../config/firebaseConfig";
import { Platform } from "react-native";
import Colors from "../../constant/Colors";

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [nameList, setNameList] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState(() => () => {});

  const showConfirm = (message, onConfirmCallback) => {
    setConfirmMessage(message);
    setOnConfirm(() => onConfirmCallback);
    setConfirmVisible(true);
  };

  const fetchStudents = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const data = querySnapshot.docs
      .map((doc) => doc.data())
      .filter((user) => user.role === "student");
    setStudents(data);
    setFilteredStudents(data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddStudents = async () => {
    const names = nameList
      .split(",")
      .map((name) => name.trim())
      .filter((n) => n);

    const numToAdd = parseInt(quantity);
    if (isNaN(numToAdd) || numToAdd !== names.length) {
      showAlert("Lỗi", "Số lượng và số tên không khớp.");
      return;
    }

    setIsLoading(true);

    const currentCount = students.length;
    const newStudents = [];

    for (let i = 0; i < numToAdd; i++) {
      const index = currentCount + i + 1;
      const msv = `s2025${index.toString().padStart(4, "0")}`;
      const email = `${msv}@st.neu.edu.vn`;
      const name = names[i];
      const password = "123456";

      try {
        await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", email), {
          msv,
          name,
          email,
          password,
          role: "student",
        });

        newStudents.push({ msv, name, email, password });
      } catch (err) {
        console.error(`Lỗi thêm sinh viên ${name}:`, err);
        showAlert("Lỗi", `Không thể thêm sinh viên: ${name}`);
      }
    }

    setIsLoading(false);

    if (newStudents.length > 0) {
      showAlert("Thành công", `Đã thêm ${newStudents.length} sinh viên.`);
    }

    setModalVisible(false);
    setQuantity("");
    setNameList("");
    fetchStudents();
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredStudents(students);
      return;
    }

    const result = students.filter((student) =>
      student.msv.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );

    setFilteredStudents(result);
  };

  const handleDisableStudent = (student) => {
    showConfirm(
      `Bạn có muốn vô hiệu hóa tài khoản của sinh viên ${student.name}?`,
      async () => {
        try {
          const userRef = doc(db, "users", student.email);
          await updateDoc(userRef, { disable: true });

          showAlert("Thành công", `Đã vô hiệu hóa sinh viên ${student.name}`);
          fetchStudents();
        } catch (err) {
          console.error(`Lỗi khi vô hiệu hóa ${student.name}:`, err);
          showAlert("Lỗi", `Không thể vô hiệu hóa sinh viên: ${student.name}`);
        }
      }
    );
  };

  const handleEnableStudent = (student) => {
    showConfirm(
      `Bạn có muốn mở khóa tài khoản của sinh viên ${student.name}?`,
      async () => {
        try {
          const userRef = doc(db, "users", student.email);
          await updateDoc(userRef, { disable: false });

          showAlert(
            "Thành công",
            `Đã mở khóa tài khoản sinh viên ${student.name}`
          );
          fetchStudents();
        } catch (err) {
          console.error(`Lỗi khi mở khóa ${student.name}:`, err);
          showAlert("Lỗi", `Không thể mở khóa sinh viên: ${student.name}`);
        }
      }
    );
  };

  const showAlert = (title, message) => {
    if (Platform.OS === "web") {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  return (
    <View
      style={{
        overflowY: "auto",
        maxHeight: "calc(100dvh - 15dvh)",
        padding: 20,
      }}
    >
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <TextInput
          placeholder="Tìm theo mã SV"
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 5,
            padding: 10,
            marginRight: 10,
          }}
        />
        <TouchableOpacity
          onPress={handleSearch}
          style={{
            backgroundColor: Colors.PRIMARY,
            borderRadius: 5,
            padding: 10,
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#fff" }}>Tìm</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={{
          padding: 12,
          backgroundColor: Colors.PRIMARY,
          borderRadius: 8,
          marginBottom: 20,
          position: "sticky",
        }}
        onPress={() => setModalVisible(true)}
      >
        <Text
          style={{
            color: "#fff",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Thêm sinh viên
        </Text>
      </TouchableOpacity>
      <View style={{ marginBottom: 10 }}>
        {/* Header */}
        <View
          style={{ flexDirection: "row", backgroundColor: "#ddd", padding: 10 }}
        >
          <Text style={{ flex: 1, fontWeight: "bold" }}>Mã SV</Text>
          <Text style={{ flex: 2, fontWeight: "bold" }}>Họ tên</Text>
          <Text style={{ flex: 2, fontWeight: "bold" }}>Email</Text>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Password</Text>
        </View>

        {/* Data */}
        <FlatList
          data={filteredStudents}
          keyExtractor={(item) => item.email}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                padding: 10,
                borderBottomWidth: 1,
                borderColor: "#ccc",
                alignItems: "center",
                backgroundColor: item.disable ? "#eee" : "transparent",
                opacity: item.disable ? 0.5 : 1,
              }}
            >
              <Text style={{ flex: 1 }}>{item.msv}</Text>
              <Text style={{ flex: 2 }}>{item.name}</Text>
              <Text style={{ flex: 2 }}>{item.email}</Text>
              <Text style={{ flex: 1 }}>{item.password}</Text>
              <TouchableOpacity
                onPress={() =>
                  item.disable
                    ? handleEnableStudent(item)
                    : handleDisableStudent(item)
                }
                style={{
                  backgroundColor: item.disable ? "green" : "orange",
                  paddingVertical: 4,
                  paddingHorizontal: 8,
                  borderRadius: 5,
                  marginLeft: 10,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 12 }}>
                  {item.disable ? "Mở khóa TK" : "Khóa tài khoản"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      {/* Modal thêm sinh viên */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View
          style={{
            flex: 1,
            backgroundColor: "#000000aa",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              minWidth: "50%",
              maxWidth: "70%",
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              elevation: 5,
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
            >
              Thêm sinh viên
            </Text>
            {isLoading && (
              <Text style={{ color: "red", marginBottom: 10 }}>
                Đang xử lý...
              </Text>
            )}

            <TextInput
              placeholder="Số lượng sinh viên"
              keyboardType="number-pad"
              value={quantity}
              onChangeText={setQuantity}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 10,
                borderRadius: 5,
                marginBottom: 10,
              }}
            />
            <TextInput
              placeholder="Danh sách tên, cách nhau bằng dấu phẩy"
              value={nameList}
              onChangeText={setNameList}
              multiline
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 10,
                borderRadius: 5,
                height: 100,
                marginBottom: 10,
                textAlignVertical: "top",
              }}
            />
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  padding: 10,
                  backgroundColor: "#ccc",
                  borderRadius: 5,
                  marginRight: 10,
                }}
              >
                <Text>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddStudents}
                disabled={isLoading}
                style={{
                  padding: 10,
                  backgroundColor: isLoading ? "#999" : Colors.PRIMARY,
                  borderRadius: 5,
                }}
              >
                <Text style={{ color: "#fff" }}>
                  {isLoading ? "Đang thêm..." : "Thêm"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal khóa/mở khóa sinh viên */}
      <Modal visible={confirmVisible} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              minWidth: "50%",
            }}
          >
            <Text style={{ fontSize: 16, marginBottom: 20 }}>
              {confirmMessage}
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <TouchableOpacity
                onPress={() => setConfirmVisible(false)}
                style={{
                  padding: 10,
                  backgroundColor: "#ccc",
                  borderRadius: 5,
                  marginRight: 10,
                }}
              >
                <Text>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setConfirmVisible(false);
                  onConfirm();
                }}
                style={{
                  padding: 10,
                  backgroundColor: "red",
                  borderRadius: 5,
                }}
              >
                <Text style={{ color: "#fff" }}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
