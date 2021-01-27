import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, View } from "react-native";
import {
  FlatList,
  ScrollView,
  TouchableOpacity
} from "react-native-gesture-handler";
import InputField from "../components/inputField";
import Message from "../components/Message";

interface conversationProps {}



const Conversation = ({}) => {
  const [text, setText] = useState('');
  const [count, setCount] = useState(12);
  const [data, setData] = useState([]);


  useEffect(() => {

    let temp: any = [
    {
      id: 1,
      fromId: 1,
      toId: 2,
      message: "Test message",
      time: "2021-01-27T13:07:27Z",
    },
    {
      id: 2,
      fromId: 2,
      toId: 1,
      message: "How are you",
      time: "2021-01-27T13:07:27Z",
    },
    {
      id: 3,
      fromId: 1,
      toId: 2,
      message: "I am good ! so whats up this seems to be the long message",
      time: "2021-01-27T13:07:27Z",
    },
    {
      id: 4,
      fromId: 2,
      toId: 1,
      message: "Test message",
      time: "2021-01-27T13:07:27Z",
    },
    {
      id: 5,
      fromId: 1,
      toId: 2,
      message: "Test message",
      time: "2021-01-27T13:07:27Z",
    },
    {
      id: 6,
      fromId: 2,
      toId: 1,
      message: "How are you",
      time: "2021-01-27T13:07:27Z",
    },
    {
      id: 7,
      fromId: 1,
      toId: 2,
      message: "I am good ! so whats up this seems to be the long message",
      time: "2021-01-27T13:07:27Z",
    },
    {
      id: 8,
      fromId: 1,
      toId: 2,
      message: "Test message",
      time: "2021-01-27T13:07:27Z",
    },
    {
      id: 9,
      fromId: 1,
      toId: 2,
      message: "I am good ! so whats up this seems to be the long message",
      time: "2021-01-27T13:07:27Z",
    },
    {
      id: 10,
      fromId: 2,
      toId: 1,
      message: "Test message",
      time: "2021-01-27T13:07:27Z",
    }]

    setData(temp);
    

  }, [])


   
  
  const sendMessage = (text:string) => {
    console.log(text);
    let obj: any = {
      id: count,
      fromId: 2,
      toId: 1,
      message: text,
      time: "2021-01-27T13:07:27Z",
    }
    let temp = [...data];
    temp.push(obj);
    setData(temp);
    setCount(count+1);
    setText('');
  }

  const scrollRef:any = useRef(); 


  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={-500}
      style={{ flex: 1, backgroundColor: "#fff" }}
    >
      {/* <View style={{marginLeft:15, marginRight:15}}> */}
      <ScrollView style={{ height: "90%", paddingLeft: 10, paddingRight: 10 }}
       ref={scrollRef}
       onContentSizeChange={() => scrollRef.current?.scrollToEnd({animated: true})}>
        <FlatList
          data={data}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({ item }: any) => (
            <Message item={item} listType={"chats"} />
          )}
        />
      </ScrollView>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <InputField
          placeholder="message"
          width="86%"
          placeholderTextColor="#6159E6"
          backgroundColor="#E8E3FF"
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity
          style={{
            marginLeft: 5,
            backgroundColor: "#6159E6",
            borderRadius: 50,
          }}

          onPress={() => sendMessage(text)}
        >
          <Ionicons
            name="paper-plane-outline"
            size={20}
            color="#FFF"
            style={{ padding: 8 }}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Conversation;
