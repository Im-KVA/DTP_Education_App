import { View, Text } from "react-native";
import React from "react";

export default function ClassList({ classList }) {
  return (
    <View
      style={{
        marginTop: 15,
      }}
    >
      <Text
        style={{
          fontWeight: " bold",
          fontSize: 25,
        }}
      >
        Class
      </Text>

      <FlatList
        data={classList}
        renderItem={({ item, index }) => (
          <View key={index}>
            <Text>{item?.classTitle}</Text>
          </View>
        )}
      ></FlatList>
    </View>
  );
}
