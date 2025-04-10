import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";
import Colors from "../../constant/Colors";
import ClassChatList from "./ClassChatList";

export default function ClassListFilter() {
  const [filter, setFilter] = useState("current");

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <FilterButton
          text="Lớp học hiện tại"
          isActive={filter === "current"}
          onPress={() => setFilter("current")}
        />
        <FilterButton
          text="Đã ẩn"
          isActive={filter === "hidden"}
          onPress={() => setFilter("hidden")}
        />
      </View>
      <ClassChatList filter={filter} />
    </View>
  );
}

const FilterButton = ({ text, isActive, onPress }) => (
  <TouchableOpacity
    style={[styles.button, isActive && styles.activeButton]}
    onPress={onPress}
  >
    <Text style={[styles.buttonText, isActive && styles.activeText]}>
      {text}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  filterContainer: {
    flexDirection: "row",
    gap: 30,
    marginBottom: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#ddd",
    borderRadius: 6,
  },
  activeButton: {
    backgroundColor: Colors.PRIMARY,
  },
  buttonText: {
    fontSize: 16,
    color: "#333",
  },
  activeText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
