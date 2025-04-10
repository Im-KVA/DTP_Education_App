import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
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
import { useRouter } from "expo-router";

export default function ClassChatList({ filter }) {
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

  const filteredClasses = classes.filter((cls) => {
    const isStudent = userDetail.role === "student";
    const isTeacher = userDetail.role === "teacher";

    const isRegistered =
      isStudent && cls.students?.[userDetail.email] !== undefined;
    const isAssignedTeacher =
      isTeacher && cls.classTeacherId === userDetail.mgv;

    const isParticipant = isRegistered || isAssignedTeacher;
    const isHidden = cls.hiddenFor?.[userDetail.email] === true;

    if (filter === "current") return isParticipant && !isHidden;
    if (filter === "hidden") return isParticipant && isHidden;

    return false;
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
    <FlatList
      data={filteredClasses}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      renderItem={({ item }) => {
        return (
          <View style={styles.classItem}>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/chatroom",
                  params: { classId: item.id },
                })
              }
            >
              <Text style={styles.className}>{item.className}</Text>
              <Text style={styles.studentCount}>
                Số lượng: {item.numStudent} / {item.numStudentMax}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => {
                const classRef = doc(db, "classes", item.id);
                try {
                  const classSnap = await getDoc(classRef);
                  const data = classSnap.data();
                  const currentHidden = data.hiddenFor || {};
                  const newHidden = {
                    ...currentHidden,
                    [userDetail.email]: !currentHidden?.[userDetail.email],
                  };

                  await updateDoc(classRef, { hiddenFor: newHidden });
                  fetchClasses();
                } catch (err) {
                  console.error("Lỗi khi cập nhật hiddenFor:", err);
                }
              }}
              style={[
                styles.hideToggleContainer,
                item.hiddenFor?.[userDetail.email]
                  ? { backgroundColor: Colors.LIGHT_GREEN }
                  : { backgroundColor: Colors.LIGHT_RED },
              ]}
            >
              <Text
                style={[
                  styles.hideToggleText,
                  item.hiddenFor?.[userDetail.email]
                    ? styles.showColor
                    : styles.hideColor,
                ]}
              >
                {item.hiddenFor?.[userDetail.email] ? "Hiện" : "Ẩn"}
              </Text>
            </TouchableOpacity>
          </View>
        );
      }}
    />
  );
}

const styles = {
  hideToggleContainer: {
    padding: 10,
    borderRadius: 15,
    marginRight: 10,
  },
  hideToggleText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  hideColor: {
    color: "red",
  },
  showColor: {
    color: "green",
  },
  classItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
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
