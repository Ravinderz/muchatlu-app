import React from "react";
import { Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import InputField from "../components/inputField";
import { AuthNavProps } from "../params/AuthParamList";

export default function Register({navigation,route} : AuthNavProps<'Register'>) {
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding"
    keyboardVerticalOffset={-500}>
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
        <Text style={{ fontSize: 24, marginBottom:20 }}>Sign Up</Text>
        <InputField placeholder="Username"/>
        <InputField placeholder="Email address"/>
        <InputField placeholder="Password"/>
        <TouchableOpacity style={styles.btnPrimary}>
          <Text style={{ color: "#FFF" }}>Submit</Text>
        </TouchableOpacity>
      </View>
      <View style={{justifyContent:'center',alignItems:'center', margin:20}}>
        <Text>Already a member ? <Text style={{color:'#6159E6'}} onPress={() => navigation.navigate('Login')}>Sign In</Text></Text>
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
  signUpLink:{

  }
});
