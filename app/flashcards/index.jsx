import {
  View,
  Image,
  Text,
  Pressable,
  Dimensions,
  FlatList,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../../constant/Colors";
import FlipCard from "react-native-flip-card";

export default function Flashcards() {
  const { docParams } = useLocalSearchParams();
  const router = useRouter();
  const doc = JSON.parse(docParams);
  const flashcards = doc?.flashcards;
  const width = Dimensions.get("screen").width * 0.78;

  const [currentPage, setCurrentPage] = useState(0);

  const onMomentumScrollEnd = (event) => {
    const snapInterval = width + Dimensions.get("screen").width * 0.05 * 2;
    const index = Math.round(
      event?.nativeEvent?.contentOffset.x / snapInterval
    );
    console.log(index);
    setCurrentPage(index);
  };

  return (
    <View>
      <Image
        source={require("./../../assets/images/wave.png")}
        style={{
          height: 800,
          width: "100%",
        }}
      />
      <View
        style={{
          position: "absolute",
          padding: 25,
          marginTop: 30,
          width: "100%",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back-outline" size={30} color="white" />
          </Pressable>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 25,
              color: Colors.WHITE,
            }}
          >
            {currentPage + 1} of {flashcards?.length}
          </Text>
        </View>
        <FlatList
          data={flashcards}
          horizontal={true}
          pagingEnabled={false}
          showsHorizontalScrollIndicator={false}
          snapToInterval={width + Dimensions.get("screen").width * 0.05 * 2}
          decelerationRate="fast"
          onMomentumScrollEnd={onMomentumScrollEnd}
          renderItem={({ item, index }) => (
            <View
              key={index}
              style={{
                height: 500,
                marginTop: 70,
              }}
            >
              <FlipCard style={styles?.flipCard}>
                {/* Face Side */}
                <View style={styles.frontCard}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 28,
                      padding: 10,
                      textAlign: "center",
                    }}
                  >
                    {item?.front}
                  </Text>
                </View>
                {/* Back Side */}
                <View style={styles.backCard}>
                  <Text
                    style={{
                      backgroundColor: Colors.LIGHT_GREEN,
                      padding: 15,
                      fontWeight: "bold",
                      fontSize: 20,
                      borderRadius: 15,
                    }}
                  >
                    {item?.front}
                  </Text>
                  <Text
                    style={{
                      width: Dimensions.get("screen").width * 0.78,
                      padding: 20,
                      fontSize: 20,
                      textAlign: "center",
                      color: Colors.WHITE,
                    }}
                  >
                    {item?.back}
                  </Text>
                </View>
              </FlipCard>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flipCard: {
    width: Dimensions.get("screen").width * 0.78,
    height: 400,
    backgroundColor: Colors.WHITE,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    marginHorizontal: Dimensions.get("screen").width * 0.05,
    borderColor: Colors.GRAY,
    borderWidth: 2,
    borderRadius: 20,
    elevation: 1,
  },
  frontCard: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    borderRadius: 20,
    elevation: 1,
  },
  backCard: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    backgroundColor: Colors.LIGHT_PRIMARY,
    borderRadius: 20,
    elevation: 1,
  },
});
