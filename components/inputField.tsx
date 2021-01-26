import React from "react";
import { StyleSheet, TextInput } from "react-native";

export default function InputField(props: any) {

  return (
    <TextInput
      style={[styles.input,props?.style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    height: 40,
    backgroundColor:'#F4F2FF',
    marginTop:10,
    marginBottom:10,
    padding:5,
    paddingLeft:20,
    borderRadius:30
  },
});
