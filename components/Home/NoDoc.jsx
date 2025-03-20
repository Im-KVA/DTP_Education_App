import { View, Text, Image } from "react-native";
import React from "react";
import Button from "../Shared/Button";
import { useRouter } from "expo-router";

export default function NoDoc() {
  const router = useRouter();
  return (
    <View
      style={{
        marginTop: 40,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Image
        source={require("./../../assets/images/book.png")}
        style={{
          height: 200,
          width: 200,
        }}
      />
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 25,
          textAlign: "center",
        }}
      >
        Bạn chưa có tài liệu nào!!
      </Text>
      <Text
        style={{
          fontSize: 15,
          textAlign: "center",
          marginTop: 5,
        }}
      >
        Hãy liên hệ giảng viên của bạn để nhận tài liệu hoặc đăng ký vào một lớp
        học
      </Text>
      <Button
        text={"Đăng ký lớp học"}
        type="fill"
        onPress={() => router.push("/(tabs)/explore")}
      />
      <Button text={"Liên hệ giảng viên"} type="outline" />
    </View>
  );
}
