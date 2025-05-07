import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const Header = ({ setView }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerTop}>
        <Image
          source={require("../../assets/images/logo-removebg.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>
          E-learning MineDuck - Giao diện giáo viên
        </Text>
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          onPress={() => setView("classes")}
          style={[styles.button, { backgroundColor: "#007bff" }]}
        >
          <Text style={styles.buttonText}>Danh sách lớp</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setView("docs")}
          style={[styles.button, { backgroundColor: "#28a745" }]}
        >
          <Text style={styles.buttonText}>Danh sách tài liệu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setView("discuss")}
          style={[styles.button, { backgroundColor: "#e0a22d" }]}
        >
          <Text style={styles.buttonText}>Danh sách phòng thảo luận</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerTop: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  button: {
    padding: 10,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
  },
});

export default Header;
