import { View, Text, StyleSheet } from "react-native";
import React from "react";
import ClassListFilter from "../../components/Discuss/ClassListFilter";

export default function Discuss() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Phòng thảo luận</Text>
      <ClassListFilter />
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
