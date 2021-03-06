import React, { useContext } from "react";
import { Image, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AuthContext } from "../Providers/AuthProvider";

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

const Message = ( props: any,) => {  
  const data = props.item;
  const navigation = props.navigation;
  const { user } = useContext(AuthContext);
  const userId = user.id;
  const item = data;
  item.read = true;
  let time;
  if (item.timestamp) {
    time = adjustForTimezone(item.timestamp);
  }

  const renderContent = () => {
    if (item.type === "text") {
      return (
        <Text style={{ fontSize: 14, marginBottom: 4, color: "#fff" }}>
          {item.message}
        </Text>
      );
    }
    if (item.type === "image-url") {
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ImageView", {
              data:item,
              img: item.message,
            });
          }}
        >
          <Image
            style={{ height: 275, width: 275, marginBottom: 5 }}
            source={{
              uri: item.message,
            }}
          />
        </TouchableOpacity>
      );
    }
    if (item.type === "image") {
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ImageView", {
              data:item,
              img: `data:image/png;base64,${item.data}`,
            });
          }}
        >
          <Image
            style={{ height: 275, width: 275, marginBottom: 5 }}
            source={{
              uri: `data:image/png;base64,${item.data}`,
            }}
          />
        </TouchableOpacity>
      );
    }
  };

  return (
    <View
      style={{
        padding: 5,
        width: "100%",
      }}
    >
      <View
        style={{
          flex: 1,
          maxWidth: "80%",
          alignSelf: item.userIdFrom === userId ? "flex-end" : "flex-start",
          backgroundColor: item.userIdFrom === userId ? "#7E7E81" : "#6159E6",
          padding: 10,
          borderTopRightRadius: item.userIdFrom === userId ? 0 : 15,
          borderTopLeftRadius: item.userIdFrom === userId ? 15 : 0,
          borderBottomRightRadius: 15,
          borderBottomLeftRadius: 15,
          marginBottom:-5
        }}
      >
        {renderContent()}
        <Text
          style={{
            fontSize: 12,
            marginBottom: 4,
            color: "rgba(255, 255, 255, 0.5)",
            alignSelf: "flex-end",
          }}
        >
          {time ? time : ""}
        </Text>
      </View>
    </View>
  );
};
export default Message;
// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "row",
//     padding: 5,
//     width: "80%",
//   },
//   avatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 50 / 2,
//     marginRight: 10,
//     marginLeft: -5,
//   },
//   time: {
//     fontSize: 12,
//     color: "#A4A4A4",
//   },
// });
