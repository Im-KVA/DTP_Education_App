import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import Colors from "../../constant/Colors";
import { useRouter } from "expo-router";
import { updatePassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../config/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useLocalSearchParams } from "expo-router";
import NfcManager, { NfcTech } from "react-native-nfc-manager";

export default function ChangePassword() {
  const { emailSV, msvSV } = useLocalSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState(emailSV || "");
  const [msv, setMsv] = useState(msvSV || "");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const changePassword = async () => {
    if (!msv || !email || !password || !newPassword) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Thông báo", "Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    Alert.alert("Xác thực", "Hãy xác thực bằng thẻ NFC để đổi mật khẩu...");
    readNfc();
  };

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

        const text = decodeTextPayload(payload);

        if (text === msv) {
          console.log("🧾 Dữ liệu từ thẻ NFC:", text);

          try {
            const userCredential = await signInWithEmailAndPassword(
              auth,
              email,
              password
            );
            Alert.alert("Xin chờ", "🎉 Hệ thống đang đổi mật khẩu...");

            const user = userCredential.user;

            await updatePassword(user, newPassword);

            await setDoc(
              doc(db, "users", email),
              { password: newPassword },
              { merge: true }
            );

            Alert.alert("Thành công", "🎉 Đổi mật khẩu thành công!");
            router.back();
          } catch (error) {
            console.log("❌ Lỗi xác thực:", error);
            Alert.alert(
              "Lỗi",
              "❌ Mật khẩu hiện tại không đúng hoặc có lỗi xảy ra."
            );
          }
        } else {
          Alert.alert(
            "Thất bại",
            "Thẻ sinh viên không khớp. Vui lòng thử lại với thẻ chính xác!"
          );
          setPassword("");
          setNewPassword("");
        }
      } else {
        Alert.alert("Thông báo", "❌ Không tìm thấy dữ liệu trong thẻ.");
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
    <ScrollView>
      <View style={styles.container}>
        <Image
          source={require("./../../assets/images/logo-neu.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Đổi mật khẩu</Text>
        <TextInput
          placeholder="Mã sinh viên"
          value={msv}
          editable={false}
          onChangeText={setMsv}
          style={styles.textInput}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          editable={false}
          style={styles.textInput}
        />
        {/* Mật khẩu hiện tại */}
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Mật khẩu hiện tại"
            onChangeText={setPassword}
            value={password}
            secureTextEntry={!showPassword}
            style={styles.textInputFlex}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.eyeIcon}>{showPassword ? "🙈" : "👁️"}</Text>
          </TouchableOpacity>
        </View>

        {/* Mật khẩu mới */}
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Mật khẩu mới"
            onChangeText={setNewPassword}
            value={newPassword}
            secureTextEntry={!showNewPassword}
            style={styles.textInputFlex}
          />
          <TouchableOpacity
            onPress={() => setShowNewPassword(!showNewPassword)}
          >
            <Text style={styles.eyeIcon}>{showNewPassword ? "🙈" : "👁️"}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={changePassword} style={styles.button}>
          <Text style={styles.buttonText}>Đổi mật khẩu</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    marginTop: 100,
    flex: 1,
    padding: 25,
  },
  logo: {
    width: 180,
    height: 180,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 20,
  },
  textInput: {
    borderWidth: 1,
    width: "100%",
    padding: 15,
    fontSize: 18,
    marginTop: 20,
    borderRadius: 8,
  },
  button: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    width: "100%",
    marginTop: 25,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    color: Colors.WHITE,
    textAlign: "center",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    width: "100%",
    paddingHorizontal: 10,
    marginTop: 20,
    borderRadius: 8,
  },
  textInputFlex: {
    flex: 1,
    padding: 15,
    fontSize: 18,
  },
  eyeIcon: {
    fontSize: 20,
    padding: 10,
  },
});
