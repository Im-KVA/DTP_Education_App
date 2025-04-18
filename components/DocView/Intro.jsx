import { View, Text, Image } from "react-native";
import { imageAssets } from "../../constant/Option";
import Feather from "@expo/vector-icons/Feather";
import React from "react";
import Colors from "../../constant/Colors";

export default function Intro({ doc, classTilte }) {
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
            {doc?.chapters?.length} Chương - Lớp: {classTilte}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
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
              textAlign: "justify",
            }}
          >
            {doc?.description}
          </Text>
        </View>
      </View>
    </View>
  );
}
