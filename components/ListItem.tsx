import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useContext, useState } from "react";
import {
  AsyncStorage,
  DeviceEventEmitter,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { AuthContext } from "../Providers/AuthProvider";
import IMAGES from "./../assets/index.js";
import { URI } from './../constants';

const adjustForTimezone = (value: Date) => {
  if (value) {
    let date = new Date(value);
    var timeOffsetInMS: number = new Date().getTimezoneOffset() * 60000;
    date.setTime(date.getTime() + timeOffsetInMS);
    return get12HourFormat(date.toISOString());
  } else {
    return get12HourFormat(value);
  }
};

const get12HourFormat = (value: any) => {
  var date = new Date(value);
  var hours: any =
    date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
  var am_pm = date.getHours() >= 12 ? "PM" : "AM";
  hours = hours < 10 ? "0" + hours : hours;
  var minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  var time = hours + ":" + minutes + " " + am_pm;
  return time;
};

const ListItem = (props: any) => {
  const item = props.item;
  const listType = props.listType;
  const { user } = useContext(AuthContext);
  const userId = user.id;

  if (listType && listType === "friends") {
    let temp = item.avatar.split("/");
    let name = temp[temp.length - 1].split(".")[0];
    const imgSrc = IMAGES[name];

    return (
      <View style={styles.container}>
        <Image style={styles.avatar} source={imgSrc} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 4 }}>
            {item.username}
          </Text>
          <Text style={{ fontSize: 12, color: "#A4A4A4" }} numberOfLines={1}>
            {item?.status}
          </Text>
        </View>
      </View>
    );
  } else if (listType && listType === "chats") {
    let temp =
      user.id === item.userIdFrom
        ? item.avatarTo.split("/")
        : item.avatarFrom.split("/");
    let name = temp[temp.length - 1].split(".")[0];
    const imgSrc = IMAGES[name];
    const itemTime = adjustForTimezone(item.lastMessageTimestamp);
    const [showLastMessage, setShowLastMessage] = useState(item && item.lastMessageFrom ? true : false);
    console.log("showLastMessage",showLastMessage)

    return (
      <View style={styles.container}>
        <Image style={styles.avatar} source={imgSrc} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 4 }}>
            {user.id === item.userIdFrom ? item.usernameTo : item.usernameFrom}
          </Text>
          {/* {showLastMessage} ? ( */}
          <Text style={{ fontSize: 12, color: "#A4A4A4" }} numberOfLines={1}>
            {item?.lastMessageFrom}:{item.lastMessage}  
          </Text>
          {/* ):(<></>) */}
        </View>
        <View>
          <Text style={styles.time}>{itemTime}</Text>
        </View>
      </View>
    );
  } else if (listType && listType === "friendRequests") {

    let temp =
      userId === item.requestFromUserId
        ? item.avatarTo.split("/")
        : item.avatarFrom.split("/");
    let name = temp[temp.length - 1].split(".")[0];
    const imgSrc = IMAGES[name];

    let showBtns: boolean = false;
    if (item.status === "Pending" && userId === item.requestToUserId) {
      showBtns = true;
    } else {
      showBtns = false;
    }
    // const showBtns: boolean = ((item.status === "Accepted" || item.status === "Rejected") && userId !== item.requestFromUserId) ? false : true;

    const updateFriendRequest = async (status: string) => {
      let tokenObj = await AsyncStorage.getItem("token");
      let storedToken = null;
      if (tokenObj !== null) {
        storedToken = JSON.parse(tokenObj);
      }
      item.status = status;
      try {
        let response = await fetch(
          URI.updateFriendRequest,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${storedToken.token}`,
            },
            body: JSON.stringify(item),
          }
        );

        let json = await response.json();
        if (json) {
          DeviceEventEmitter.emit("FRIEND-REQUEST-UPDATE-EVENT", json);
        }
        return json;
      } catch (error) {
        console.error(error);
      }
    };

    if (showBtns) {
      return (
        <View style={[styles.container, { ...props.style }]}>
          <Image style={styles.avatar} source={imgSrc} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 4 }}>
              {userId === item.requestFromUserId
                ? item.requestToUsername
                : item.requestFromUsername}
            </Text>
            <Text
              style={{
                paddingLeft: 5,
                paddingRight: 5,
                fontSize: 12,
                color:
                  item.status === "Accepted"
                    ? "#017815"
                    : item.status === "Pending"
                    ? "#FFb01c"
                    : "#ff4e4e",
                borderWidth: 1,
                borderColor:
                  item.status === "Accepted"
                    ? "#017815"
                    : item.status === "Pending"
                    ? "#FFb01c"
                    : "#ff4e4e",
                alignSelf: "flex-start",
              }}
            >
              {item?.status}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={{ marginLeft: 3, marginRight: 3 }}
              onPress={() => updateFriendRequest("Accepted")}
            >
              <MaterialIcons
                name="check-circle-outline"
                size={40}
                color="#017815"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginLeft: 3, marginRight: 3 }}
              onPress={() => updateFriendRequest("Rejected")}
            >
              <MaterialCommunityIcons
                name="close-circle-outline"
                size={40}
                color="#ff4e4e"
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <View style={[styles.container, { ...props.style }]}>
          <Image style={styles.avatar} source={imgSrc} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 4 }}>
              {userId === item.requestFromUserId
                ? item.requestToUsername
                : item.requestFromUsername}
            </Text>
            <Text
              style={{
                paddingLeft: 5,
                paddingRight: 5,
                fontSize: 12,
                color:
                  item.status === "Accepted"
                    ? "#017815"
                    : item.status === "Pending"
                    ? "#FFb01c"
                    : "#ff4e4e",
                borderWidth: 1,
                borderColor:
                  item.status === "Accepted"
                    ? "#017815"
                    : item.status === "Pending"
                    ? "#FFb01c"
                    : "#ff4e4e",
                alignSelf: "flex-start",
              }}
            >
              {item?.status}
            </Text>
          </View>
        </View>
      );
    }
  }
};
export default ListItem;
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
    paddingBottom: 10,
    paddingTop: 10,
    borderBottomColor: "#A4A4A4",
    borderBottomWidth: 0.5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    marginRight: 10,
    marginLeft: -5,
  },
  time: {
    fontSize: 12,
    color: "#A4A4A4",
  },
});
