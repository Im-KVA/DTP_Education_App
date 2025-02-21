import { View, Text, TextInput, Image, StyleSheet } from "react-native";
import React from "react";
import Colors from "./../../constant/Colors";

export default function SignUp() {
  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        marginTop: 100,
        flex: 1,
        backgroundColor: Colors.WHITE,
      }}
    >
      <Image
        source={require("./../../assets/images/logo-neu.png")}
        style={{
          width: 180,
          height: 180,
        }}
      />

      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
          marginTop: 20,
        }}
      >
        Thông Tin Tài Khoản
      </Text>

      <TextInput placeholder="Full Name" style={styles.TextInput} />
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    width: "100%",
    padding: 15,
  },
});
