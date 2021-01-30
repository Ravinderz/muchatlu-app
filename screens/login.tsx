import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  const getUserFromStorage = async () => {
    let user = await AsyncStorage.getItem('user');
    let obj :any;
    if(user !== null){
      obj = JSON.parse(user);
      return obj;  
    }else{
      setLoading(false);
    }
    return null;
    
  }

  useEffect(() => {
    getUserFromStorage();
    return () => {
    }
  }, [])

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={-500}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
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
              secureTextEntry={true}
            />
            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={() => login(email, password)}
            >
              <Text style={{ color: "#FFF" }}>Submit</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              margin: 20,
            }}
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
      )}
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
