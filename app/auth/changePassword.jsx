import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useContext, useState } from "react";
import Colors from "../../constant/Colors";
import { useRouter } from "expo-router";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth, db } from "../../config/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { UserDetailContext } from "../../context/UserDetailContext";
import { useLocalSearchParams } from "expo-router";

export default function ChangePassword() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState(params.email || "");
  const [msv, setMsv] = useState(params.msv || "");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { setUserDetail } = useContext(UserDetailContext);

  const changePassword = async () => {
    if (!msv || !email || !password || !newPassword) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Thông báo", "Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user || user.email !== email) {
        Alert.alert("Thông báo", "Vui lòng đăng nhập lại để đổi mật khẩu!");
        return;
      }

      const credential = EmailAuthProvider.credential(email, password);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      Alert.alert("Thông báo", "Mật khẩu đã được cập nhật thành công!");

      router.back();
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Thông báo",
        "Mật khẩu hiện tại không đúng hoặc có lỗi xảy ra!"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("./../../assets/images/logo-neu.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Đổi mật khẩu</Text>
      <TextInput
        placeholder="Mã sinh viên"
        value={msv}
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
      <TextInput
        placeholder="Mật khẩu hiện tại"
        onChangeText={setPassword}
        secureTextEntry
        style={styles.textInput}
      />
      <TextInput
        placeholder="Mật khẩu mới"
        onChangeText={setNewPassword}
        secureTextEntry
        style={styles.textInput}
      />
      <TouchableOpacity onPress={changePassword} style={styles.button}>
        <Text style={styles.buttonText}>Đổi mật khẩu</Text>
      </TouchableOpacity>
    </View>
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
});
