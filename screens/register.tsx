import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import InputField from "../components/inputField";
import { AuthNavProps } from "../params/AuthParamList";
import { URI } from './../constants';

const Register = ({ navigation, route }: AuthNavProps<"Register">) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const randomIntFromInterval = (min: number, max: number) => {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const registerUser = async () => {
    const imgPath = "./../../assets/avatars/";
    const avatar = imgPath + "cats_" + randomIntFromInterval(1, 33) + ".jpg";
    let obj = {
      username: username,
      email: email,
      password: password,
      avatar: avatar,
      status: "Hi! I am available.",
    };
    try {
      let response = await fetch(URI.register, {
        method:"POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      });

      let json = await response.json();
      if (json) {
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={-500}
    >
      <ScrollView>
        <View style={styles.logo}>
          <Image
            style={{
              height: 100,
              width: 100,
              resizeMode: "contain",
            }}
            source={require("./../assets/logo.png")}
          />
        </View>
        <View style={styles.logo}>
          <Image
            style={{
              height: 250,
              width: 350,
              resizeMode: "contain",
            }}
            source={require("./../assets/images/login_img.png")}
          />
        </View>
        <View style={styles.formContainer}>
          <Text style={{ fontSize: 24, marginBottom: 20 }}>Sign Up</Text>
          <InputField placeholder="Username" value={username} onChangeText={setUsername}/>
          <InputField placeholder="Email address" value={email} onChangeText={setEmail}/>
          <InputField placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={true}/>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => registerUser()}
          >
            <Text style={{ color: "#FFF" }}>Submit</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{ justifyContent: "center", alignItems: "center", margin: 20 }}
        >
          <Text>
            Already a member ?{" "}
            <Text
              style={{ color: "#6159E6" }}
              onPress={() => navigation.navigate("Login")}
            >
              Sign In
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  logo: {
    marginTop: 25,
    flexDirection: "row",
    justifyContent: "center",
  },
  formContainer: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  btnPrimary: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#6159E6",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    height: 40,
    borderRadius: 35,
  },
  signUpLink: {},
});
