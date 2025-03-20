import { View, StyleSheet, Text } from "react-native";
import React from "react";
import ClassStatus from "../../components/ExploreClass/ClassStatus";

export default function Explore() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Khám phá lớp học</Text>
      <ClassStatus />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    marginTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
});
