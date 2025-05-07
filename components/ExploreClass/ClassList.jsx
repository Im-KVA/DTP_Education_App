import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TextInput,
} from "react-native";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { UserDetailContext } from "../../context/UserDetailContext";
import Colors from "../../constant/Colors";

export default function ClassList({ filter }) {
  const { userDetail } = useContext(UserDetailContext);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "classes"));
      const classData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClasses(classData);
    } catch (error) {
      console.error("Lỗi tải danh sách lớp:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchClasses();
    setRefreshing(false);
  }, []);

  const handleRegister = async (classId) => {
    if (!userDetail || !userDetail.email) {
      Alert.alert("Lỗi", "Bạn chưa đăng nhập!");
      return;
    }

    const classRef = doc(db, "classes", classId);
    try {
      const classSnap = await getDoc(classRef);
      if (!classSnap.exists()) {
        console.log("Lớp không tồn tại!");
        return;
      }

      const classData = classSnap.data();
      if (classData.numStudent >= classData.numStudentMax) {
        Alert.alert("Thông báo", "Lớp đã đầy!");
        return;
      }

      const updatedStudents = {
        ...(classData.students || {}),
        [userDetail.email]: false,
      };

      await updateDoc(classRef, {
        numStudent: classData.numStudent + 1,
        students: updatedStudents,
      });

      Alert.alert("Thành công", "Đăng ký lớp học thành công! Chờ xét duyệt.");
      fetchClasses();
    } catch (error) {
      console.error("Lỗi đăng ký lớp:", error);
      Alert.alert("Lỗi", "Đăng ký thất bại, vui lòng thử lại.");
    }
  };

  const handleUnregister = async (classId) => {
    Alert.alert(
      "Xác nhận hủy đăng ký",
      "Bạn có chắc chắn muốn hủy đăng ký lớp này? Hành động này không thể hoàn tác.",
      [
        { text: "Quay lại", style: "cancel" },
        {
          text: "OK, tôi hiểu",
          style: "destructive",
          onPress: async () => {
            if (!userDetail || !userDetail.email) {
              Alert.alert("Lỗi", "Bạn chưa đăng nhập!");
              return;
            }

            const classRef = doc(db, "classes", classId);
            try {
              const classSnap = await getDoc(classRef);
              if (!classSnap.exists()) {
                console.log("Lớp không tồn tại!");
                return;
              }

              const classData = classSnap.data();

              if (classData.students?.[userDetail.email]) {
                Alert.alert("Lỗi", "Bạn chưa đăng ký lớp này!");
                return;
              }

              const updatedStudents = { ...classData.students };
              delete updatedStudents[userDetail.email];

              await updateDoc(classRef, {
                numStudent: classData.numStudent - 1,
                students: updatedStudents,
              });

              Alert.alert("Thành công", "Hủy đăng ký lớp thành công!");
              fetchClasses();
            } catch (error) {
              console.error("Lỗi hủy đăng ký lớp:", error);
              Alert.alert("Lỗi", "Hủy đăng ký thất bại, vui lòng thử lại.");
            }
          },
        },
      ]
    );
  };

  const filteredClasses = classes.filter((cls) => {
    const isRegistered = cls.students?.[userDetail.email] !== undefined;
    const matchFilter =
      filter === "registered"
        ? isRegistered
        : filter === "open"
        ? cls.status === "open" && !isRegistered
        : true;

    const matchSearch = cls.id
      .toLowerCase()
      .includes(searchText.trim().toLowerCase());

    return matchFilter && matchSearch;
  });

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color={Colors.PRIMARY}
        style={{ marginTop: 20 }}
      />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        placeholder="Nhập mã lớp để tìm kiếm..."
        value={searchText}
        onChangeText={setSearchText}
        style={styles.searchInput}
      />

      <FlatList
        data={filteredClasses}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{ flexGrow: 1 }}
        renderItem={({ item }) => {
          const isRegistered = item.students?.[userDetail.email] !== undefined;
          const studentStatus = item.students?.[userDetail.email];

          return (
            <View style={styles.classItem}>
              <Text style={styles.className}>Tên lớp: {item.className}</Text>
              <Text style={styles.classId}>Mã lớp: {item.classId}</Text>
              <Text style={styles.studentCount}>
                Số lượng: {item.numStudent} / {item.numStudentMax}
              </Text>

              {isRegistered ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 5,
                  }}
                >
                  {studentStatus === false ? (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <Text style={styles.waitingText}>Đang chờ xét duyệt</Text>
                      <TouchableOpacity
                        onPress={() => handleUnregister(item.id)}
                      >
                        <Text style={styles.unregisterText}>
                          {" "}
                          (Hủy đăng ký)
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <Text style={styles.registeredText}>
                        Đã đăng ký thành công
                      </Text>
                      <Text style={styles.closedText}>Lớp đã đóng</Text>
                    </View>
                  )}
                </View>
              ) : item.numStudent < item.numStudentMax ? (
                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={() => handleRegister(item.id)}
                >
                  <Text style={styles.buttonText}>Đăng ký</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.closedText}>Lớp đã đầy</Text>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = {
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 5,
    backgroundColor: "#fff",
  },
  classItem: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  className: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.PRIMARY,
  },
  classId: {
    fontSize: 16,
    marginVertical: 5,
  },
  studentCount: {
    fontSize: 16,
    marginVertical: 5,
  },
  registerButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  waitingText: {
    color: "orange",
    fontSize: 14,
    fontWeight: "bold",
  },
  registeredText: {
    color: "green",
    fontSize: 14,
    fontWeight: "bold",
  },
  unregisterText: {
    color: "red",
    fontSize: 14,
    fontWeight: "bold",
  },
  closedText: {
    fontStyle: "italic",
    color: "gray",
  },
};
