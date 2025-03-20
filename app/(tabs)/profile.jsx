import { View, Text } from "react-native";
import { signOut } from "firebase/auth";
import { UserDetailContext } from "./../../context/UserDetailContext";
import { auth } from "../../config/firebaseConfig";
import React, { useContext } from "react";
import Button from "../../components/Shared/Button";
import { useRouter } from "expo-router";

export default function Profile() {
  const router = useRouter();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  const logOut = async () => {
    try {
      await signOut(auth);
      setUserDetail(null);
      router.replace("/");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button text={"Đăng Xuất"} onPress={logOut} type="fill" />
    </View>
  );
}
