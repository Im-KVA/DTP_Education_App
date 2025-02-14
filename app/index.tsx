import { Text, View, Image, StyleSheet } from "react-native";
import Colors from "./../constant/Colors";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.WHITE,
      }}
    >
      <Image
        source={require("./../assets/images/landing.png")}
        style={{
          width: "100%",
          height: 300,
          marginTop: 70,
        }}
      />

      <View
        style={{
          padding: 25,
          backgroundColor: Colors.PRIMARY,
          height: "100%",
          borderTopLeftRadius: 35,
          borderTopRightRadius: 35,
        }}
      >
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            textAlign: "center",
            color: Colors.WHITE,
          }}
        >
          Chào mừng tới ứng dụng Quản lý học tập
        </Text>
        <Text
          style={{
            fontSize: 15,
            marginTop: 20,
            textAlign: "center",
            color: Colors.WHITE,
          }}
        >
          Quản lý thông tin sinh viên. Quản lý quá trình học tập. Quản lý bài
          giảng và ghi chép.{"\n"}
          {"\n"}🧑‍🎓 TẤT CẢ TRONG MỘT!! 🤖
        </Text>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Bắt đầu</Text>
        </View>
        <View
          style={[
            styles.button,
            {
              backgroundColor: Colors.PRIMARY,
              borderWidth: 1,
              borderColor: Colors.WHITE,
            },
          ]}
        >
          <Text style={[styles.buttonText, { color: Colors.WHITE }]}>
            Đăng nhập bằng MSV / NFC
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 18,
    backgroundColor: Colors.WHITE,
    marginTop: 20,
    borderRadius: 10,
  },
  buttonText: {
    textAlign: "center",
    color: Colors.PRIMARY,
    fontSize: 18,
    //fontWeight: "bold",
  },
});
