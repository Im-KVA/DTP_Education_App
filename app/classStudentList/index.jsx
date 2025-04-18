import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { UserDetailContext } from "../../context/UserDetailContext";
import Colors from "../../constant/Colors";
import { router, useRouter } from "expo-router";

export default function ClassStudentList() {
  const { userDetail } = useContext(UserDetailContext);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "classes"));
      const classData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const registeredClasses = classData.filter(
        (cls) => cls.students?.[userDetail.email] === true
      );

      setClasses(registeredClasses);
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

  const filteredClasses = classes.filter(
    (cls) => cls.students?.[userDetail.email] === true
  );

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
    <View
      style={{
        marginTop: 40,
        padding: 20,
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 32,
        }}
      >
        Danh sách lớp
      </Text>
      <FlatList
        data={filteredClasses}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.classItem}
            onPress={() => {
              router.push({
                pathname: "/classDocList",
                params: {
                  classId: item.classId,
                  className: item.className,
                },
              });
            }}
          >
            <Text style={styles.className}>{item.className}</Text>
            <Text style={styles.studentCount}>
              Số lượng: {item.numStudent} / {item.numStudentMax}
            </Text>
            <Text style={styles.registeredText}>Đã đăng ký thành công</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = {
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
