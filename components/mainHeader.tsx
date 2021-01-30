import React, { useContext, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import IMAGES from "../assets/index.js";
import { AuthContext } from "../Providers/AuthProvider";

const MainHeader = (props: any) => {
  //   const item = props.item;
  const { user, logout } = useContext(AuthContext);
  let temp = user.avatar.split("/");
  let name = temp[temp.length - 1].split(".")[0];
  const imgSrc = IMAGES[name];
  const [showLogout, setShowLogout] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>
        Mu<Text style={{ color: "#6159E6" }}>chat</Text>lu
      </Text>
      <TouchableOpacity
        onPress={() => {
          setShowLogout(!showLogout);
        }}
      >
        <Image
          source={imgSrc}
          style={{ width: 40, height: 40, borderRadius: 20 }}
        />
      </TouchableOpacity>
      {showLogout ? (
        <View
          style={{
            position: "absolute",
            left: "70%",
            top: "13%",
            backgroundColor: "#F4F2FF",
            borderRadius: 3,
          }}
        >
          <TouchableOpacity onPress={() => logout(user)}>
            <Text style={{ padding: 10, color: "#6159E6", fontWeight: "600" }}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};

export default MainHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
  },
});
