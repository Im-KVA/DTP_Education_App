import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { imageAssets } from "../../constant/Option";
import Colors from "../../constant/Colors";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";

export default function DocList({ docList }) {
  const router = useRouter();

  return (
    <View
      style={{
        marginTop: 15,
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 25,
          margin: 10,
        }}
      >
        Bài giảng
      </Text>

      <FlatList
        data={docList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/docView",
                params: {
                  docParams: JSON.stringify(item),
                  docId: item.id,
                  classId: item.classId,
                },
              })
            }
            key={index}
            style={styles.docContainer}
          >
            <Image
              source={imageAssets[item.banner_image]}
              style={{
                width: "100%",
                height: 150,
                borderRadius: 15,
              }}
            />
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 18,
                marginTop: 10,
              }}
            >
              {item?.Title}
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
              <Feather name="book" size={18} color="black" />
              <Text style={{ fontSize: 15 }}>
                {item?.chapters?.length} Chương
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  docContainer: {
    padding: 8,
    backgroundColor: Colors.BG_GRAY,
    margin: 6,
    borderRadius: 15,
    width: 250,
  },
});
