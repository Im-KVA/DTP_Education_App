import { View, Text, Platform } from "react-native";
import React from "react";
import Header from "../../components/Home/Header";

export default function Home() {
  return (
    <View
      style={{
        padding: 25,
        paddingTop: Platform.OS == "ios" && 45,
      }}
    >
      <Header />
    </View>
  );
}
