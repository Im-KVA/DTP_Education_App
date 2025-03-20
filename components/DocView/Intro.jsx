import { View, Text, Image } from "react-native";
import { imageAssets } from "../../constant/Option";
import Feather from "@expo/vector-icons/Feather";
import React from "react";
import Colors from "../../constant/Colors";
import Button from "../Shared/Button";

export default function Intro({ doc }) {
  return (
    <View>
      <Image
        source={imageAssets[doc?.banner_image]}
        style={{
          width: "100%",
          height: 250,
          marginTop: 50,
        }}
      />

      <View
        style={{
          padding: 20,
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 20,
            marginTop: 10,
          }}
        >
          {doc?.Title}
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 5,
            alignItems: "center",
            marginTop: 5,
          }}
        >
          <Feather name="book" size={15} color={Colors.PRIMARY} />
          <Text
            style={{
              fontSize: 15,
              color: Colors.PRIMARY,
            }}
          >
            {doc?.chapters?.length} Chương
          </Text>
        </View>
        <View>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 20,
              marginTop: 10,
            }}
          >
            Mô tả:
          </Text>
          <Text
            style={{
              fontSize: 15,
              marginTop: 5,
              color: Colors.GRAY,
            }}
          >
            {doc?.description}
          </Text>
        </View>
        <Button text={"Bắt Đầu Ngay"} type="fill" style />
      </View>
    </View>
  );
}
