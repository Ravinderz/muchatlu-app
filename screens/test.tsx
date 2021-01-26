import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Test() {
  return (
    <View style={styles.container}>
    <Text>This is the Test Element</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: "center",
    alignItems: "center",
  }
});
