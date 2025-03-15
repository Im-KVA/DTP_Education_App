import { View, Text, FlatList, Image } from "react-native";
import { PracticeOption } from "../../constant/Option";
import React from "react";
import Colors from "../../constant/Colors";

export default function Practice() {
  return (
    <View>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 25,
          margin: 10,
        }}
      >
        Luyện tập
      </Text>

      <FlatList
        data={PracticeOption}
        scrollEnabled={false}
        numColumns={3}
        renderItem={({ item, index }) => (
          <View
            key={index}
            style={{
              flex: 1,
              margin: 5,
              aspectRatio: 1,
            }}
          >
            <Image
              source={item?.image}
              style={{
                width: "100%",
                height: "100%",
                maxHeight: 160,
                borderRadius: 15,
              }}
            />
            <Text
              style={{
                position: "absolute",
                padding: 15,
                fontSize: 14,
                color: Colors.WHITE,
              }}
            >
              {item.name}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
