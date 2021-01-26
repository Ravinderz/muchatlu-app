import React, { Component } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import IMAGES from "./../assets/index.js";

class ListItem extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: props.item,
      listType:props.listType,
      loading: true,
      userId: 1,
    };
  }

  adjustForTimezone(value: Date): any {
    if (value) {
      let date = new Date(value);
      var timeOffsetInMS: number = new Date().getTimezoneOffset() * 60000;
      date.setTime(date.getTime() + timeOffsetInMS);
      return this.get12HourFormat(date.toISOString());
    } else {
      return this.get12HourFormat(value);
    }
  }

  get12HourFormat(value: any) {
    var date = new Date(value);
    var hours: any =
      date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    var am_pm = date.getHours() >= 12 ? "PM" : "AM";
    hours = hours < 10 ? "0" + hours : hours;
    var minutes =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var time = hours + ":" + minutes + " " + am_pm;
    return time;
  }

  render() {
    const listType = this.state.listType;
    const item = this.state.data;

    if(listType && listType === 'friends'){
      let temp = item.avatar.split("/");
      let name = temp[temp.length - 1].split(".")[0];
      const imgSrc = IMAGES[name];

      return (
        <View style={styles.container}>
          <Image style={styles.avatar} source={imgSrc} />
          <View style={{flex: 1}}>
            <Text style={{ fontSize: 16, fontWeight: "700",marginBottom:4 }}>
              {item.username}
            </Text>
            <Text style={{ fontSize: 12,color:"#A4A4A4"}} numberOfLines={1}>
              {item?.status}
            </Text>
          </View>
        </View>
      );
    }else if(listType && listType === 'chats'){

      let temp = item.avatarTo.split("/");
      let name = temp[temp.length - 1].split(".")[0];
      const imgSrc = IMAGES[name];
      const itemTime = this.adjustForTimezone(item.lastMessageTimestamp);

      return (
        <View style={styles.container}>
          <Image style={styles.avatar} source={imgSrc} />
          <View style={{flex: 1}}>
            <Text style={{ fontSize: 16, fontWeight: "700",marginBottom:4 }}>
              {item.usernameTo}
            </Text>
            <Text style={{ fontSize: 12,color:"#A4A4A4"}} numberOfLines={1}>
              {item?.lastMessageFrom}:{item.lastMessage}
            </Text>
          </View>
          <View>
            <Text style={styles.time}>{itemTime}</Text>
          </View>
        </View>
      );
    }else if(listType && listType === 'friendRequests'){

      let temp = this.state.userId === item.requestFromUserId ? item.avatarTo.split("/") : item.avatarFrom.split("/");
      let name = temp[temp.length - 1].split(".")[0];
      const imgSrc = IMAGES[name];
      const itemTime = this.adjustForTimezone(item.lastMessageTimestamp);

      return (
        <View style={styles.container}>
          <Image style={styles.avatar} source={imgSrc} />
          <View style={{flex: 1}}>
            <Text style={{ fontSize: 16, fontWeight: "700",marginBottom:4 }}>
              {this.state.userId === item.requestFromUserId ? item.requestToUsername : item.requestFromUsername}
            </Text>
            <Text style={{ fontSize: 12,color:"#A4A4A4"}} numberOfLines={1}>
              {item?.status}
            </Text>
          </View>
        </View>
      );
    }      
  }
}
export default ListItem;
const styles = StyleSheet.create({
  container: {    
    flexDirection: "row",
    justifyContent:"space-between",
    padding: 5,
    paddingBottom:10,
    paddingTop:10,
    borderBottomColor: "#A4A4A4",
    borderBottomWidth: 0.5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    marginRight:10,
    marginLeft:-5
  },
  time:{
    fontSize:12,
    color:"#A4A4A4"
  }
});
