import { View, Text, Image } from "react-native";
import React from "react";
import Button from "../Shared/Button";
import { useRouter } from "expo-router";

export default function NoClass() {
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
        Bạn chưa có lớp học nào
      </Text>

      <Button
        text={"Tham gia lớp học"}
        type="fill"
        onPress={() => router.push("/addClass")}
      />
      <Button text={"Liên hệ giảng viên"} type="outline" />
    </View>
  );
}
