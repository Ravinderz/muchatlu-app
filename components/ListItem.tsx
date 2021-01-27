import React, { useContext, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { AuthContext } from "../Providers/AuthProvider";
import IMAGES from "./../assets/index.js";

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
  const data = props.item;
  const listType = props.listType;
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const userId = user.id;

  const item = data;

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
    let temp = item.avatarTo.split("/");
    let name = temp[temp.length - 1].split(".")[0];
    const imgSrc = IMAGES[name];
    const itemTime = adjustForTimezone(item.lastMessageTimestamp);

    return (
      <View style={styles.container}>
        <Image style={styles.avatar} source={imgSrc} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 4 }}>
            {item.usernameTo}
          </Text>
          <Text style={{ fontSize: 12, color: "#A4A4A4" }} numberOfLines={1}>
            {item?.lastMessageFrom}:{item.lastMessage}
          </Text>
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
    const itemTime = adjustForTimezone(item.lastMessageTimestamp);

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
              color: item.status === 'Accepted' ? "#017815" : item.status === 'Pending' ? "#FFb01c": "#ff4e4e",
              borderWidth: 1,
              borderColor:  item.status === 'Accepted' ? "#017815" : item.status === 'Pending' ? "#FFb01c": "#ff4e4e",
              alignSelf:"flex-start"     
            }}
          >
            {item?.status}
          </Text>
        </View>
      </View>
    );
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
