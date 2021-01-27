import React, { useContext, useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { AuthContext } from "../Providers/AuthProvider";
import IMAGES from "./../assets/index.js";

const ChatHeader = (props: any) => {
//   const item = props.item;
  const { user, headerItem } = useContext(AuthContext);
  const data = headerItem;
  const userId = user.id;
  let temp = data.avatarTo.split("/");
  let name = temp[temp.length - 1].split(".")[0];
  const imgSrc = IMAGES[name]; 


  useEffect(() => {
    console.log(headerItem);
     
  }, [])

  

  return (
    <View style={styles.container}>
      <Image source={imgSrc} style={{width:40,height:40, borderRadius:20}} />
      <View style={{marginLeft:10}}>
          <Text style={{fontSize:16, fontWeight:"600"}}>{data.usernameTo}</Text>
          <Text style={{fontSize:12,color:"rgba(0,0,0,0.5)"}}>{data.isUserToOnline ? 'Online' : 'Offline'}</Text>
      </View>
    </View>
  );
};

export default ChatHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginLeft:-30,    
    padding: 5,
  },
});
