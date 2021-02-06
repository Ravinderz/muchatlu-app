import React, { useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View
} from "react-native";
import { AuthContext } from "../Providers/AuthProvider";

let data: any

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
  getFullFormat(value);
  var hours: any =
    date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
  var am_pm = date.getHours() >= 12 ? "PM" : "AM";
  hours = hours < 10 ? "0" + hours : hours;
  var minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  var time = hours + ":" + minutes + " " + am_pm;
  return time;
};
const getFullFormat = (value:any) =>{
  let date = new Date(value);
    var timeOffsetInMS: number = new Date().getTimezoneOffset() * 60000;
    date.setTime(date.getTime() + timeOffsetInMS);
  return date.toString().slice(0, 15);
}

const ImgViewHeader = (props: any, {route}:any) => {
  
  if(props && props.route){
    data = props.route.params.data;
  }

  console.log(props);

  const { user } = useContext(AuthContext);
  const userId = user.id;
  console.log(">>>>>>>>>>>>>>>>>>>>>>> userid", userId);

  let time;
  let date;
  if (data.timestamp) {
    time = adjustForTimezone(data.timestamp);
    date = `${getFullFormat(data.timestamp)}, ${time}`;
  }
  
  useEffect(() => {

    return () => {
    };
  }, []);

  

  return (
    <View style={styles.container}>

      <View style={{ marginLeft: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>
          {data?.usernameFrom}
        </Text>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>
          {date}
        </Text>
      </View>
    </View>
  );
};

export default ImgViewHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginLeft: -30,
    padding: 5,
  },
});
