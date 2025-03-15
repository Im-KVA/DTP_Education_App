import { View, Text, FlatList, Image } from "react-native";
import React from "react";
import { imageAssets } from "../../constant/Option";
import Colors from "../../constant/Colors";
import * as Progress from "react-native-progress";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function LearnProgress({ docList }) {
  return (
    <View>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 25,
          margin: 10,
        }}
      >
        Tiến trình học tập
      </Text>

      <FlatList
        data={docList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View
            style={{
              margin: 7,
              padding: 7,
              backgroundColor: Colors.BG_GRAY,
              borderRadius: 15,
              width: 250,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 8,
              }}
            >
              <Image
                source={imageAssets[item?.banner_image]}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 8,
                }}
              />

              <View
                style={{
                  flex: 1,
                  flexShrink: 1,
                }}
              >
                <Text
                  numberOfLines={2}
                  style={{
                    fontWeight: "bold",
                    fontSize: 15,
                  }}
                >
                  {item?.Title}
                </Text>

                <Text
                  style={{
                    fontSize: 12,
                    marginTop: 2,
                  }}
                >
                  {item?.chapters?.length} Chương
                </Text>
              </View>
            </View>

            <View style={{ marginTop: 10 }}>
              <Progress.Bar progress={0.3} width={230} />

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 5,
                }}
              >
                <MaterialCommunityIcons
                  name="file-document-edit-outline"
                  size={15}
                  color="black"
                />
                <Text> Hoàn thành 3/5 chương</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}
