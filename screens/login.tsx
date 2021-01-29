import React, { useContext, useState } from "react";
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
import { AuthContext } from "../Providers/AuthProvider";


export default function Login({ navigation, route }: AuthNavProps<"Login">) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("r@abc.com");
  const [password, setPassword] = useState("1");

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
          <Text style={{ fontSize: 24, marginBottom: 20 }}>Sign In</Text>
          <InputField
            placeholder="Email address"
            onChangeText={setEmail}
            value={email}
          />
          <InputField
            placeholder="Password"
            onChangeText={setPassword}
            value={password}
          />
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => login(email, password)}
          >
            <Text style={{ color: "#FFF" }}>Submit</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{ justifyContent: "center", alignItems: "center", margin: 20 }}
        >
          <Text>
            Not a member ?{" "}
            <Text
              style={{ color: "#6159E6" }}
              onPress={() => navigation.navigate("Register")}
            >
              Sign Up
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

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
