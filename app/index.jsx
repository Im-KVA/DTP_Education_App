import { useEffect, useContext } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import Colors from "../constant/Colors";
import { useRouter } from "expo-router";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/firebaseConfig";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { UserDetailContext } from "../context/UserDetailContext";
import NfcManager, { NfcTech } from "react-native-nfc-manager";

export default function Index() {
  const router = useRouter();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user?.email) {
        const result = await getDoc(doc(db, "users", user.email));
        setUserDetail(result.data());
        router.replace("/(tabs)/home");
      }
    });

    return () => unsubscribe();
  }, []);

  const readNfc = async () => {
    try {
      console.log("📡 Starting NFC manager...");
      await NfcManager.start();

      const isEnabled = await NfcManager.isEnabled();
      console.log("✅ NFC enabled:", isEnabled);

      // Cancel previous tech if still hanging
      await NfcManager.cancelTechnologyRequest();

      Alert.alert(
        "Thông báo",
        "📡 Đưa thẻ NFC lại gần thiết bị để bắt đầu đọc..."
      );
      console.log("📥 Requesting technology...");
      await NfcManager.requestTechnology(NfcTech.Ndef);

      console.log("📦 Reading tag...");
      const tag = await NfcManager.getTag();

      // Giải mã text từ payload NDEF
      if (tag?.ndefMessage && tag.ndefMessage.length > 0) {
        // Đọc record đầu tiên
        const ndefRecord = tag.ndefMessage[0];
        const payload = ndefRecord.payload;

        const msvFromTag = decodeTextPayload(payload);
        console.log("🧾 MSV từ thẻ NFC:", msvFromTag);

        const q = query(
          collection(db, "users"),
          where("msv", "==", msvFromTag)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          const { email, password } = userData;

          console.log("🔐 Đang đăng nhập với:", email);

          try {
            const userCredential = await signInWithEmailAndPassword(
              auth,
              email,
              password
            );

            const user = userCredential.user;
            setUserDetail(userData);

            Alert.alert("🎉 Thành công", "Đăng nhập bằng thẻ NFC thành công!");
            router.replace("/(tabs)/home");
          } catch (error) {
            console.log("❌ Lỗi đăng nhập:", error);
            Alert.alert("Lỗi", "Đăng nhập thất bại!");
          }
        } else {
          Alert.alert("Không tìm thấy", "Không có sinh viên nào khớp với MSV.");
        }
      } else {
        Alert.alert(
          "Thông báo",
          "❌ Không tìm thấy dữ liệu văn bản trong thẻ."
        );
      }
    } catch (ex) {
      console.warn("❌ Lỗi đọc NFC:", ex);
      alert("Không đọc được thẻ NFC!");
    } finally {
      console.log("🔚 Hủy NFC request");
      await NfcManager.cancelTechnologyRequest();
    }
  };

  const decodeTextPayload = (payload) => {
    // Theo chuẩn NDEF Text Record: byte đầu là status (ngôn ngữ + encoding)
    // Bỏ 3 byte đầu tiên (encoding + language code)
    const textBytes = payload.slice(3);
    const decoder = new TextDecoder("utf-8");
    return decoder.decode(new Uint8Array(textBytes));
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.WHITE,
      }}
    >
      <Image
        source={require("./../assets/images/landing.png")}
        style={{
          width: "100%",
          height: 300,
          marginTop: 70,
        }}
      />

      <View
        style={{
          padding: 25,
          backgroundColor: Colors.PRIMARY,
          height: "100%",
          borderTopLeftRadius: 35,
          borderTopRightRadius: 35,
        }}
      >
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            textAlign: "center",
            color: Colors.WHITE,
          }}
        >
          Chào mừng tới ứng dụng Quản lý học tập
        </Text>

        <Text
          style={{
            fontSize: 15,
            marginTop: 20,
            textAlign: "center",
            color: Colors.WHITE,
          }}
        >
          Quản lý thông tin sinh viên. Quản lý quá trình học tập. Quản lý bài
          giảng và ghi chép.{"\n"}
          {"\n"}🧑‍🎓 TẤT CẢ TRONG MỘT!! 🤖
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/auth/signIn")}
        >
          <Text style={styles.buttonText}>Bắt đầu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={readNfc}
          style={[
            styles.button,
            {
              backgroundColor: Colors.PRIMARY,
              borderWidth: 1,
              borderColor: Colors.WHITE,
            },
          ]}
        >
          <Text style={[styles.buttonText, { color: Colors.WHITE }]}>
            Đăng nhập bằng NFC
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 18,
    backgroundColor: Colors.WHITE,
    marginTop: 20,
    borderRadius: 10,
  },
  buttonText: {
    textAlign: "center",
    color: Colors.PRIMARY,
    fontSize: 18,
  },
});
