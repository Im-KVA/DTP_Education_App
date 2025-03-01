import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useContext, useState } from "react";
import Colors from "../../constant/Colors";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../config/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { UserDetailContext } from "./../../context/UserDetailContext";

export default function SignUp() {
  const router = useRouter();
  const [msv, setMSV] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  const ChangePassword = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (resp) => {
        const user = resp.user;
        console.log(user);
        await SaveUser(user);
        //Save user to DB
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  const SaveUser = async (user) => {
    const data = {
      msv: msv,
      email: email,
      member: true,
      uid: user?.uid,
    };
    await setDoc(doc(db, "users", email), data);

    setUserDetail(data);
  };

  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        marginTop: 100,
        flex: 1,
        padding: 25,
      }}
    >
      <Image
        source={require("./../../assets/images/logo-neu.png")}
        style={{
          width: 180,
          height: 180,
        }}
      />

      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
          marginTop: 20,
        }}
      >
        Đổi mật khẩu
      </Text>

      <TextInput
        placeholder="Mã sinh viên"
        onChangeText={(value) => setMSV(value)}
        style={styles.textInput}
      />
      <TextInput
        placeholder="Email sinh viên: ...@st.neu.edu.vn"
        onChangeText={(value) => setEmail(value)}
        style={styles.textInput}
      />
      <TextInput
        placeholder="Mật khẩu hiện tại"
        secureTextEntry={true}
        style={styles.textInput}
      />
      <TextInput
        placeholder="Mật khẩu mới"
        onChangeText={(value) => setPassword(value)}
        secureTextEntry={true}
        style={styles.textInput}
      />
      <TouchableOpacity
        onPress={ChangePassword}
        style={{
          padding: 15,
          backgroundColor: Colors.PRIMARY,
          width: "100%",
          marginTop: 25,
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            color: Colors.WHITE,
            textAlign: "center",
          }}
        >
          Đổi mật khẩu
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    width: "100%",
    padding: 15,
    fontSize: 18,
    marginTop: 20,
    borderRadius: 8,
  },
});
