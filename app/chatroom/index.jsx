import React, { useEffect, useState, useContext, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  getDoc,
  where,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { UserDetailContext } from "../../context/UserDetailContext";
import Colors from "../../constant/Colors";

export default function ChatRoom() {
  const { userDetail } = useContext(UserDetailContext);
  const { classId } = useLocalSearchParams();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [classInfo, setClassInfo] = useState(null);
  const [pinnedMessage, setPinnedMessage] = useState(null);

  const flatListRef = useRef(null);

  // console.log("📌 ChatRoom mounted!");
  // console.log("🧠 classId from params:", classId);
  // console.log("👤 userDetail:", userDetail);

  const messagesRef = collection(db, "classes", classId, "chats_history");

  useEffect(() => {
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const fetchClassInfo = async () => {
      try {
        const docRef = doc(db, "classes", classId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setClassInfo(docSnap.data());
        } else {
          console.warn("⚠️ Class not found!");
        }
      } catch (error) {
        console.error("🚨 Error fetching class info:", error);
      }
    };

    fetchClassInfo();

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const teacherMessages = chatList.filter(
        (msg) => msg.senderRole === "teacher"
      );
      const lastTeacherMessage = teacherMessages[teacherMessages.length - 1];

      const filteredMessages = lastTeacherMessage
        ? chatList.filter((msg) => msg.id !== lastTeacherMessage.id)
        : chatList;

      const updatedMessages = lastTeacherMessage
        ? [lastTeacherMessage, ...filteredMessages]
        : chatList;

      setMessages(updatedMessages);
      const pinned = chatList.find((msg) => msg.isPinned);
      setPinnedMessage(pinned || null);

      flatListRef.current?.scrollToEnd({ animated: true });
    });

    return () => unsubscribe();
  }, [classId]);

  const handlePinMessage = async (messageId, isPinned) => {
    try {
      const snapshot = await getDocs(messagesRef);

      const batchUpdates = snapshot.docs.map((docSnap) => {
        const shouldPin = docSnap.id === messageId && !isPinned;
        return updateDoc(docSnap.ref, { isPinned: shouldPin });
      });

      await Promise.all(batchUpdates);
      console.log(shouldPin ? "📌 Tin nhắn đã được ghim!" : "❌ Đã huỷ ghim!");
    } catch (error) {
      console.error("🚨 Error (un)pinning message:", error);
    }
  };

  const handleSend = async () => {
    console.log("📨 Send button pressed");

    if (!input.trim()) {
      console.warn("⚠️ Message is empty");
      return;
    }

    if (!userDetail?.email || !userDetail?.name) {
      console.error("❌ Missing user detail");
      return;
    }

    try {
      console.log("📝 Sending message:", input);
      await addDoc(messagesRef, {
        senderId: userDetail.email,
        senderName: userDetail.name,
        senderRole: userDetail.role,
        content: input,
        timestamp: serverTimestamp(),
        isPinned: false,
      });
      console.log("✅ Message sent!");
      setInput("");
    } catch (error) {
      console.error("🚨 Error sending message:", error);
    }
  };

  const renderItem = ({ item, index }) => {
    const isMyMessage = item.senderId === userDetail.email;
    const date = item.timestamp?.toDate?.();
    const formattedTime = date
      ? `${date.toLocaleDateString("vi-VN")} - ${date.toLocaleTimeString(
          "vi-VN",
          {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }
        )}`
      : "Đang gửi...";

    const shouldShowMeta =
      index === 0 ||
      item.senderId !== messages[index - 1]?.senderId ||
      date - messages[index - 1]?.timestamp?.toDate?.() > 15 * 60 * 1000;

    const showPinButton =
      userDetail.role === "teacher" && item.senderRole === "teacher";

    return (
      <View
        style={{
          alignItems: isMyMessage ? "flex-end" : "flex-start",
          marginVertical: 4,
        }}
      >
        {shouldShowMeta && (
          <Text style={styles.metaText}>
            {item.senderName} - {formattedTime}
          </Text>
        )}

        <View
          style={[
            styles.messageContainer,
            isMyMessage ? styles.myMessage : styles.otherMessage,
            item.isPinned && styles.pinnedTeacherMessage,
          ]}
        >
          <Text
            style={[
              styles.myMessageText,
              isMyMessage ? styles.myMessageText : styles.otherMessageText,
              item.isPinned && { color: Colors.BLACK },
            ]}
          >
            {item.content}
          </Text>
          {showPinButton && (
            <TouchableOpacity
              onPress={() => handlePinMessage(item.id, item.isPinned)}
              style={{ marginTop: 4, alignSelf: "flex-end" }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: item.isPinned ? "red" : "#e6c200",
                }}
              >
                {item.isPinned ? "❌ Huỷ ghim" : "📌 Ghim"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Image
        source={require("./../../assets/images/wave.png")}
        style={{
          height: 400,
          width: "100%",
          position: "absolute",
          top: -100,
        }}
      />

      {classInfo && (
        <View style={styles.headerContainer}>
          <Text style={styles.classTitle}>
            {classInfo.className} - Thảo luận
          </Text>
          <Text style={styles.memberCount}>
            Thành viên: {classInfo.numStudent} / {classInfo.numStudentMax}
          </Text>
        </View>
      )}

      {/* ✅ Tin nhắn được pin cố định */}
      {pinnedMessage && (
        <View
          style={[
            styles.messageContainer,
            styles.pinnedTeacherMessage,
            {
              marginLeft: 20,
              marginTop: 20,
            },
          ]}
        >
          <Text style={{ fontSize: 11, color: "#e6c200", fontWeight: "bold" }}>
            📌 Tin nhắn nổi bật từ giảng viên
          </Text>
          <Text style={[styles.otherMessageText, { marginTop: 4 }]}>
            {pinnedMessage.content}
          </Text>
        </View>
      )}

      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: 10,
          paddingBottom: 80,
          paddingTop: pinnedMessage ? 80 : 10,
        }}
        ref={flatListRef}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập tin nhắn..."
          value={input}
          onChangeText={(text) => setInput(text)}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendText}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: Colors.LIGHT_GREEN,
  },
  classTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.WHITE,
    marginBottom: 4,
  },
  memberCount: {
    fontSize: 14,
    color: Colors.LIGHT_GREEN,
  },
  container: {
    flex: 1,
    marginTop: 45,
  },
  messageContainer: {
    marginVertical: 0,
    padding: 12,
    borderRadius: 12,
    maxWidth: "85%",
  },
  pinnedTeacherMessage: {
    backgroundColor: "#fff8c6",
    borderWidth: 1,
    borderColor: "#e6c200",
    shadowColor: "#e6c200",
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  myMessage: {
    backgroundColor: Colors.PRIMARY,
    alignSelf: "flex-end",
  },
  otherMessage: {
    backgroundColor: Colors.WHITE,
    alignSelf: "flex-start",
    borderColor: "#ddd",
    borderWidth: 1,
  },
  metaText: {
    fontSize: 12,
    color: Colors.GRAY,
    marginBottom: 5,
  },
  myMessageText: {
    color: Colors.WHITE,
    fontSize: 15,
  },
  otherMessageText: {
    color: Colors.BLACK,
    fontSize: 15,
  },
  myPinnedMessageText: {
    color: Colors.BLACK,
    fontSize: 15,
  },

  inputContainer: {
    flexDirection: "row",
    padding: 14,
    borderTopWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginRight: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  sendButton: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});
