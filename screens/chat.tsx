import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useState } from "react";
import {
  DeviceEventEmitter,
  FlatList,
  StyleSheet,

  TouchableOpacity,
  View
} from "react-native";
import InputField from "../components/inputField";
import ListItem from "../components/ListItem";
import ListItemSkeleton from "../components/ListItemSkeleton";
import { AuthContext } from "../Providers/AuthProvider";
import { SocketContext } from "../Providers/SocketProvider";
import { URI } from "./../constants";
let boolObj = false;
const Chat = ({ navigation }: any) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, setHeaderItem, refreshToken } = useContext(AuthContext);
  const {
    setActiveConversationId,
    unreadconversationsMessagesCount,
  } = useContext(SocketContext);
  const [unread, setUnread] = useState({});
  const [rerender, setRerender] = useState(false);
  const [listLoading, setlistLoading] = useState(false);

  useEffect(() => {
    getConversations();
    setActiveConversationId("0");
    setUnread(unreadconversationsMessagesCount);
    const friendRequestEvent = DeviceEventEmitter.addListener(
      "FRIEND-REQUEST-UPDATE-EVENT",
      () => {
        getConversations();
      }
    );

    const unreadEvent = DeviceEventEmitter.addListener("UNREAD-EVENT", () => {
      setUnread(unreadconversationsMessagesCount);
      if (boolObj) {
        setRerender(false);
        boolObj = false;
      } else {
        setRerender(true);
        boolObj = true;
      }
    });

    const focus = navigation.addListener("focus", () => {
      setActiveConversationId("0");
    });

    return () => {
      friendRequestEvent.remove();
      unreadEvent.remove();
      focus;
    };
  }, []);

  const getConversations = async () => {
    setlistLoading(true);
    let tokenObj = await AsyncStorage.getItem("token");
    let storedToken = null;
    if (tokenObj !== null) {
      storedToken = JSON.parse(tokenObj);
    }

    try {
      let response = await fetch(`${URI.getConversations}/${user.id}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken.token}`,
        },
      });

      console.log("chat response");
      let json = await response.json();
      if (json.message === "JWT token Expired") {
        setLoading(true);
        refreshToken(user).then((value: any) => {
          getConversations();
        });
      }

      setConversations(json);
      setLoading(false);
      setlistLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const skeletonLoading = () => {
    return (
      <>
        <ListItemSkeleton />
        <ListItemSkeleton />
      </>
    );
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      {loading ? (
        skeletonLoading()
      ) : (
        <View>
          <InputField placeholder="Search" width="100%" onKeyPress = { (e:any) => {console.log(e)}}/>
          {listLoading ? (
            skeletonLoading()
          ) : (
            <FlatList
              data={conversations}
              keyExtractor={(item: any) => item.id.toString()}
              extraData={rerender}
              refreshing={listLoading}
              onRefresh={() => getConversations()}
              renderItem={({ item }: any) => (
                <TouchableOpacity
                  onPress={() => {
                    setHeaderItem(item);
                    navigation.navigate("Conversation", {
                      item: item,
                      typingItem: {
                        userIdFrom: "",
                        userIdTo: "",
                        isTyping: false,
                        conversationId: item.id,
                      },
                    });
                  }}
                >
                  <ListItem item={item} listType={"chats"} unread={unread} />
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
