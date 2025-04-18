import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import Colors from "../../constant/Colors";

export default function Chapters({ doc, docId, classId, completedChapters }) {
  const router = useRouter();
  const screenWidth = Dimensions.get("window").width;

  const isChapterCompleted = (index) => {
    return completedChapters.includes(String(index));
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontWeight: "bold", fontSize: 20 }}>Chương</Text>
      <FlatList
        data={doc?.chapters}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/chapterView",
                params: {
                  chapterParams: JSON.stringify(item),
                  chapterIndex: index,
                  chapterDocId: docId,
                  chapterClassId: classId,
                },
              });
            }}
            style={{
              padding: 15,
              borderWidth: 0.5,
              borderRadius: 15,
              marginTop: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                maxWidth: screenWidth * 0.6,
              }}
            >
              <Text style={styles.chapterText}>{index + 1}.</Text>
              <Text style={styles.chapterText}>{item.chapterName} </Text>
            </View>
            {isChapterCompleted(index) ? (
              <AntDesign name="checkcircleo" size={24} color="green" />
            ) : (
              <Entypo name="controller-play" size={24} color={Colors.PRIMARY} />
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chapterText: {
    fontWeight: "bold",
    fontSize: 15,
  },
});
