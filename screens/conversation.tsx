import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  DeviceEventEmitter,
  Keyboard,
  KeyboardAvoidingView,
  View
} from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import GifKeyboardView from "../components/Gif-keyboard-view";
import InputField from "../components/inputField";
import Message from "../components/Message";
import MImagePicker from "../components/M_imagePicker";
import { AuthContext } from "../Providers/AuthProvider";
import { SocketContext } from "../Providers/SocketProvider";
import { URI } from "./../constants";

let freshData: any;

const Conversation = ({ navigation, route }: any) => {
  const item = route.params.item;
  const [text, setText] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [count, setCount] = useState(12);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, refreshToken } = useContext(AuthContext);
  const {
    sendMessage,
    isTyping,
    setActiveConversationId,
    setUnreadconversationsMessagesCount,
    unreadconversationsMessagesCount,
  } = useContext(SocketContext);

  useEffect(() => {
    getConversation();
    setActiveConversationId(item.id);
    let obj = unreadconversationsMessagesCount;
    obj[item.id] = 0;
    console.log(">>>>>>>>>>>>>>>>>>>>>  trigger");
    DeviceEventEmitter.emit("UNREAD-EVENT", "Visited");
    setUnreadconversationsMessagesCount(obj);
    const messageEvent = DeviceEventEmitter.addListener(
      "MESSAGE-EVENT",
      (msg: any) => {
        if (msg.conversationId === item.id) {
          let temp = [...freshData];
          temp.push(msg);
          setData(temp);
          freshData = temp;
        }
      }
    );

    const selectedImageEvent = DeviceEventEmitter.addListener(
      "SELECTED-IMAGE",
      (item: any) => {
        if (item.data) {
          sendMsg(item);
        }
      }
    );

    const gifEvent = DeviceEventEmitter.addListener(
      "SELECTED-GIF",
      (item: any) => {
        sendMsg(item);
      }
    );

    return () => {
      messageEvent.remove();
      gifEvent.remove();
      selectedImageEvent.remove();
    };
  }, []);

  const toggleModel = () => {
    setShowModel(!showModel);
    Keyboard.dismiss();
  };

  const getConversation = async () => {
    let url = `${URI.getConversation}/${item.userIdFrom}/${item.userIdTo}`;
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
      if (json.message === "JWT token Expired") {
        refreshToken(user).then((value: any) => {
          getConversation();
        });
      }
      setData(json.message);
      freshData = json.message;
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const sendMsg = (msgObj: any) => {
    let date = new Date();
    let obj;
    if (user.id === item.userIdFrom) {
      obj = {
        userIdFrom: user.id,
        userIdTo: item.userIdTo,
        usernameFrom: user.username,
        avatarFrom: user.avatar,
        usernameTo: item.usernameTo,
        avatarTo: item.avatarTo,
        message: msgObj.text.trim(),
        type: msgObj.type,
        conversationId: item.id,
        data: msgObj.data,
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
        message: msgObj.text.trim(),
        type: msgObj.type,
        conversationId: item.id,
        data: msgObj.data,
        timestamp: new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        ).toISOString(),
      };
    }

    if (msgObj.text && msgObj.text.trim() !== "" && msgObj.text !== "") {
      sendMessage(obj);
      let temp: any;
      if (data.length > 0) {
        temp = [...data, obj];
      } else {
        temp = [...freshData, obj];
      }
      //temp.push(obj);
      setData(temp);
      freshData = temp;
      setCount(count + 1);
      setText("");
      typing("");
    }
  };

  const typing = (text: any) => {
    let msg;

    if (user.id === item.userIdFrom) {
      msg = {
        userIdFrom: user.id,
        userIdTo: item.userIdTo,
        isTyping: true,
        conversationId: item.id,
      };
    } else {
      msg = {
        userIdFrom: user.id,
        userIdTo: item.userIdFrom,
        isTyping: true,
        conversationId: item.id,
      };
    }

    if (text && text.trim() !== "" && text !== "") {
      msg.isTyping = true;
    } else {
      msg.isTyping = false;
    }
    isTyping(msg);
  };

  const openImagePicker = () => {
    DeviceEventEmitter.emit("PICK-IMAGE", "clicked");
  };

  const scrollRef: any = useRef();

  return (
    <View
      style={{
        flex: 1,
        position: "relative",
      }}
    >
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={-500}
        style={{ flex: 1, backgroundColor: "#fff" }}
      >
        <FlatList
          style={{ height: "90%", paddingLeft: 10, paddingRight: 10 }}
          ref={scrollRef}
          removeClippedSubviews={true}
          maxToRenderPerBatch={30}
          // inverted={true}
          // contentContainerStyle={{ flexDirection: 'column-reverse' }}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: false })
          }
          data={data}
          keyExtractor={(item: any, idx) =>
            (item?.conversationId + idx).toString()
          }
          renderItem={({ item }: any) => (
            <Message item={item} listType={"chats"} navigation={navigation} />
          )}
        />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => toggleModel()}>
            <MaterialCommunityIcons
              name="gif"
              size={30}
              color="#6159E6"
              style={{ paddingLeft: 4 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openImagePicker()}>
            <MaterialCommunityIcons
              name="image"
              size={30}
              color="#6159E6"
              style={{ paddingLeft: 4, paddingRight: 4 }}
            />
          </TouchableOpacity>
          <InputField
            placeholder="message"
            width="68%"
            placeholderTextColor="#6159E6"
            backgroundColor="#E8E3FF"
            value={text}
            onChangeText={(text: any) => {
              setText(text);
              typing(text);
            }}
            onFocus={(e: any) => {
              if (showModel) {
                setShowModel(false);
              }
            }}
          />
          <TouchableOpacity
            onPress={() => sendMsg({ text: text, type: "text" })}
          >
            <MaterialCommunityIcons
              name="send-circle"
              size={40}
              color="#6159E6"
              style={{ padding: 8 }}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      {showModel ? <GifKeyboardView /> : <></>}
      <MImagePicker />
    </View>
  );
};

export default Conversation;
