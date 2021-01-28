import { Ionicons } from "@expo/vector-icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  AsyncStorage,
  DeviceEventEmitter,
  KeyboardAvoidingView,
  View
} from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import InputField from "../components/inputField";
import Message from "../components/Message";
import { AuthContext } from "../Providers/AuthProvider";
import { SocketContext } from "../Providers/SocketProvider";

interface conversationProps {}

const Conversation = ({ route }: any) => {
  const item = route.params.item;
  const [text, setText] = useState("");
  const [count, setCount] = useState(12);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const { sendMessage } = useContext(SocketContext);

  useEffect(() => {
    getConversation();
  }, []);

  const messageEvent = DeviceEventEmitter.addListener(
    "MESSAGE-EVENT",
    (msg: any) => {
      let temp = [...data];
      temp.push(msg);
      setData(temp);
    }
  );

  const getConversation = async () => {
    let url = `http://192.168.0.103:8080/getConversation/${item.userIdFrom}/${item.userIdTo}`;
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
      setData(json.message);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const sendMsg = (text: string) => {
    let date = new Date();
    console.log(text);
    let obj;
    if (user.id === item.userIdFrom) {
      obj = {
        userIdFrom: user.id,
        userIdTo: item.userIdTo,
        usernameFrom: user.username,
        avatarFrom: user.avatar,
        usernameTo: item.usernameTo,
        avatarTo: item.avatarTo,
        message: text.trim(),
        conversationId: item.id,
        timestamp: new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        ).toISOString(),
      };
    } else {
      obj = {
        userIdFrom: user.id,
        userIdTo: item.userIdFrom,
        usernameFrom: user.username,
        avatarFrom: user.avatar,
        usernameTo: item.usernameFrom,
        avatarTo: item.avatarFrom,
        message: text.trim(),
        conversationId: item.id,
        timestamp: new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        ).toISOString(),
      };
    }

    sendMessage(obj);
    let temp = [...data];
    temp.push(obj);
    setData(temp);
    setCount(count + 1);
    setText("");
  };

  const scrollRef: any = useRef();

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={-500}
      style={{ flex: 1, backgroundColor: "#fff" }}
    >
      {/* <View
        style={{ height: "90%", paddingLeft: 10, paddingRight: 10 }}
        ref={scrollRef}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: true })
        }
      > */}
      <FlatList
        style={{ height: "90%", paddingLeft: 10, paddingRight: 10 }}
        ref={scrollRef}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: true })
        }
        data={data}
        keyExtractor={(item: any, idx) =>
          (item?.conversationId + idx).toString()
        }
        renderItem={({ item }: any) => (
          <Message item={item} listType={"chats"} />
        )}
      />
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
          onPress={() => sendMsg(text)}
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
