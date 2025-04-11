import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  Platform,
} from "react-native";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../../config/firebaseConfig";
import Colors from "../../constant/Colors";

export default function TeacherList() {
  const [teachers, setTeachers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [nameList, setNameList] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTeachers, setFilteredTeachers] = useState([]);

  const fetchTeachers = async () => {
    const querySnapshot = await getDocs(collection(db, "users_teacher"));
    const data = querySnapshot.docs.map((doc) => doc.data());
    setTeachers(data);
    setFilteredTeachers(data);
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleAddTeachers = async () => {
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

    const currentCount = teachers.length;
    const newTeachers = [];

    for (let i = 0; i < numToAdd; i++) {
      const index = currentCount + i + 1;
      const mgv = `t2025${index.toString().padStart(4, "0")}`;
      const email = `${mgv}@st.neu.edu.vn`;
      const name = names[i];
      const password = "123456";

      try {
        await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users_teacher", email), {
          mgv,
          name,
          email,
          password,
          role: "teacher",
        });

        newTeachers.push({ mgv, name, email, password });
      } catch (err) {
        console.error(`Lỗi thêm giáo viên ${name}:`, err);
        showAlert("Lỗi", `Không thể thêm giáo viên: ${name}`);
      }
    }

    setIsLoading(false);

    if (newTeachers.length > 0) {
      showAlert("Thành công", `Đã thêm ${newTeachers.length} giáo viên.`);
    }

    setModalVisible(false);
    setQuantity("");
    setNameList("");
    fetchTeachers();
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredTeachers(teachers);
      return;
    }

    const result = teachers.filter((teacher) =>
      teacher.mgv.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );

    setFilteredTeachers(result);
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
          placeholder="Tìm theo mã GV"
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
          Thêm giáo viên
        </Text>
      </TouchableOpacity>
      <FlatList
        data={filteredTeachers}
        keyExtractor={(item) => item.email}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 10,
              marginBottom: 10,
              backgroundColor: "#f0f0f0",
              borderRadius: 8,
            }}
          >
            <Text>Mã GV: {item.mgv}</Text>
            <Text>Họ tên: {item.name}</Text>
            <Text>Email: {item.email}</Text>
            <Text>Password: {item.password}</Text>
          </View>
        )}
      />

      {/* Modal thêm giáo viên */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View
          style={{
            flex: 1,
            backgroundColor: "#000000aa",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              elevation: 5,
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
            >
              Thêm giáo viên
            </Text>
            {isLoading && (
              <Text style={{ color: "red", marginBottom: 10 }}>
                Đang xử lý...
              </Text>
            )}

            <TextInput
              placeholder="Số lượng giáo viên"
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
                onPress={handleAddTeachers}
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
    </View>
  );
}
