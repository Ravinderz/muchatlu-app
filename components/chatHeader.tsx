import React, { useContext, useEffect, useState } from "react";
import {
  AsyncStorage,
  DeviceEventEmitter,
  Image,
  StyleSheet,
  Text,
  View
} from "react-native";
import { AuthContext } from "../Providers/AuthProvider";
import IMAGES from "./../assets/index.js";
import { URI } from './../constants';

const ChatHeader = (props: any) => {
  //   const item = props.item;
  const { user, headerItem } = useContext(AuthContext);
  const data = headerItem;
  const userId = user.id;
  console.log("chat header data :: ", data);
  console.log("chat header data :: ", user);
  let temp =
    userId === data.userIdFrom
      ? data.avatarTo.split("/")
      : data.avatarFrom.split("/");
  let name = temp[temp.length - 1].split(".")[0];
  const imgSrc = IMAGES[name];
  const [isOnline, setIsOnline] = useState("");

  const loginEvent = DeviceEventEmitter.addListener(
    "LOGIN-EVENT",
    (msg: any) => {
      console.log("received message here");
      if (msg.userId === data.userIdFrom || msg.userId === data.userIdTo) {
        setIsOnline(msg.online ? "Online" : "Offline");
      }
      console.log(msg);
    }
  );

  const logoutEvent = DeviceEventEmitter.addListener(
    "LOGOUT-EVENT",
    (msg: any) => {
      console.log(msg);
      if (msg.userId === data.userIdFrom || msg.userId === data.userIdTo) {
        setIsOnline(msg.online ? "Online" : "Offline");
      }
    }
  );

  const getUserPresence = async () => {
    const id = user.id === data.userIdFrom ? data.userIdTo : data.userIdFrom;
    let url = `${URI.getUserPresence}/${id}`;
    console.log(url);
    let tokenObj = await AsyncStorage.getItem("token");
    let storedToken = null;
    if (tokenObj !== null) {
      storedToken = JSON.parse(tokenObj);
    }

    try {
      let response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken.token}`,
        },
      });

      let json = await response.json();
      console.log("user status", json);
      setIsOnline(json.online ? "Online" : "Offline");
      console.log("user status", json);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(headerItem);
    getUserPresence();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={imgSrc}
        style={{ width: 40, height: 40, borderRadius: 20 }}
      />
      <View style={{ marginLeft: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>
          {userId === data.userIdFrom ? data.usernameTo : data.usernameFrom}
        </Text>
        <Text style={{ fontSize: 12, color: "rgba(0,0,0,0.5)" }}>
          {isOnline}
        </Text>
      </View>
    </View>
  );
};

export default ChatHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginLeft: -30,
    padding: 5,
  },
});
