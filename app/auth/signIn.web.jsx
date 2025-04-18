import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Platform,
} from "react-native";
import React, { useState, useContext } from "react";
import Colors from "../../constant/Colors";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./../../config/firebaseConfig";
import { UserDetailContext } from "./../../context/UserDetailContext";
import Toast from "react-native-toast-message";
import { doc, getDoc } from "firebase/firestore";

export default function SignIn() {
  const router = useRouter();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [userRole, setUserRole] = useState("");

  const checkEmailExists = async (email) => {
    if (!email.includes("@st.neu.edu.vn")) return;

    setCheckingEmail(true);
    try {
      const userCollections = ["users", "users_teacher", "users_admin"];
      let foundUser = null;

      for (const collection of userCollections) {
        const userRef = doc(db, collection, email);
        const result = await getDoc(userRef);
        if (result.exists()) {
          foundUser = result.data();
          setUserRole(collection);
          break;
        }
      }

      if (foundUser) {
        if (
          (userRole === "users" &&
            Platform.OS !== "android" &&
            Platform.OS !== "ios") ||
          ((userRole === "users_teacher" || userRole === "users_admin") &&
            (Platform.OS === "android" || Platform.OS === "ios"))
        ) {
          Toast.show({
            type: "error",
            text1: "Lỗi đăng nhập",
            text2:
              userRole === "users"
                ? "Bạn đang dùng tài khoản sinh viên. Vui lòng đăng nhập trên điện thoại."
                : "Tài khoản bạn đang dùng không dành cho sinh viên. Vui lòng đăng nhập trên web.",
          });
          setCheckingEmail(false);
          setCurrentUser(null);
          return;
        }

        console.log(userRole);

        setEmailExists(true);
        setUserDetail(foundUser);
      } else {
        setEmailExists(false);
        setUserDetail(null);
        Toast.show({
          type: "error",
          text1: "Email không tồn tại",
          text2: "Vui lòng kiểm tra lại hoặc đăng ký tài khoản mới.",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCheckingEmail(false);
    }
  };

  const onSignIn = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng nhập đầy đủ thông tin.",
      });
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Đăng nhập thành công!",
      });

      console.log(userRole);

      if (userRole === "users") {
        await getUserDetail();
        router.replace("/(tabs)/home");
        console.log("students");
      } else if (userRole === "users_teacher") {
        router.replace("/webView/teacherView");
        console.log("teachers");
      } else if (userRole === "users_admin") {
        router.replace("/webView/admin");
        console.log("admin");
      }
    } catch (e) {
      console.log(e);
      Toast.show({
        type: "error",
        text1: "Lỗi đăng nhập",
        text2: "Email hoặc mật khẩu sai.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getUserDetail = async () => {
    try {
      const userRef = doc(db, userRole, email);
      const result = await getDoc(userRef);
      if (result.exists()) {
        setUserDetail(result.data());
      }
    } catch (error) {
      console.error("Lỗi lấy userDetail:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("./../../assets/images/logo-neu.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Thông Tin Tài Khoản</Text>

      <TextInput
        placeholder="Email: ...@st.neu.edu.vn"
        onChangeText={(value) => {
          setEmail(value);
          setEmailExists(false);
        }}
        onBlur={() => checkEmailExists(email)}
        value={email}
        style={styles.textInput}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {checkingEmail && (
        <ActivityIndicator
          size="small"
          color={Colors.PRIMARY}
          style={{ marginTop: 10 }}
        />
      )}

      {emailExists && (
        <>
          <TextInput
            placeholder="Mật khẩu"
            onChangeText={setPassword}
            value={password}
            secureTextEntry
            style={styles.textInput}
          />

          <TouchableOpacity
            onPress={onSignIn}
            style={styles.button}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Đăng Nhập</Text>
            )}
          </TouchableOpacity>
        </>
      )}

      <Toast />
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
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    color: Colors.WHITE,
    textAlign: "center",
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    marginTop: 20,
  },
  linkText: {
    color: Colors.PRIMARY,
  },
});
