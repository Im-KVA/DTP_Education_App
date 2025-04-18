import React, { useState, useContext } from "react";
import {
  View,
  Alert,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { signOut } from "firebase/auth";
import { UserDetailContext } from "./../../context/UserDetailContext";
import { auth } from "../../config/firebaseConfig";
import Button from "../../components/Shared/Button";
import { useRouter } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Colors from "../../constant/Colors";

export default function Profile() {
  const router = useRouter();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [showPassword, setShowPassword] = useState(false);

  const logOut = async () => {
    try {
      await signOut(auth);
      setUserDetail(null);
      router.replace("/");
    } catch (error) {
      Alert.alert("Thông báo", "Lỗi đăng xuất");
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 30,
        marginTop: 50,
      }}
    >
      <Image
        source={require("./../../assets/images/logo-neu.png")}
        style={styles.logo}
      />
      <View style={styles.card}>
        <Text
          style={{
            color: Colors.LIGHT_PRIMARY,
            fontWeight: "bold",
            fontSize: 24,
            textDecorationLine: "underline",
          }}
        >
          THÔNG TIN SINH VIÊN
        </Text>
        <View style={styles.cardInfo}>
          <FontAwesome6 name="building-user" size={50} color={Colors.PRIMARY} />
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            <Text style={styles.textInfo}>Họ và tên: {userDetail?.name}</Text>
            <Text style={styles.textInfo}>MSV: {userDetail?.msv}</Text>
            <Text style={styles.textInfo}>Email: {userDetail?.email}</Text>
            <Text style={styles.textInfo}>Vai trò: {userDetail?.role}</Text>
          </View>
        </View>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={styles.textInfo}>
          Mật khẩu: {showPassword ? userDetail?.password : "••••••••"}
        </Text>
        <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
          <FontAwesome6
            name={showPassword ? "eye-slash" : "eye"}
            size={16}
            color={Colors.PRIMARY}
          />
        </TouchableOpacity>
      </View>
      <Button
        text={"Đổi mật khẩu (NFC)"}
        onPress={() =>
          router.push({
            pathname: "/auth/changePassword",
            params: {
              emailSV: userDetail?.email || "",
              msvSV: userDetail?.msv || "",
            },
          })
        }
        type="outline"
      />
      <Button text={"Đăng Xuất"} onPress={logOut} type="fill" />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    backgroundColor: Colors.BG_YELLOW,
    minWidth: 200,
    minHeight: 100,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    padding: 20,
    marginBottom: 20,
  },
  cardInfo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 20,
  },
  textInfo: {
    fontSize: 13,
    fontWeight: "bold",
    color: Colors.PRIMARY,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
});
