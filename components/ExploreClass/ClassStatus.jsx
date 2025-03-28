import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import ClassList from "./ClassList";
import Colors from "../../constant/Colors";

export default function ClassStatus() {
  const [filter, setFilter] = useState("all");

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <FilterButton
          text="Tất cả"
          isActive={filter === "all"}
          onPress={() => setFilter("all")}
        />
        <FilterButton
          text="Đã đăng ký"
          isActive={filter === "registered"}
          onPress={() => setFilter("registered")}
        />
        <FilterButton
          text="Đang mở"
          isActive={filter === "open"}
          onPress={() => setFilter("open")}
        />
      </View>
      <ClassList filter={filter} />
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
    justifyContent: "space-around",
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
