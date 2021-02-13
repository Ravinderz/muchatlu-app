import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";
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

const db = SQLite.openDatabase("muchatlu.db");

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
    // getAllConversations();
    setActiveConversationId("0");
    setUnread(unreadconversationsMessagesCount);
    const friendRequestEvent = DeviceEventEmitter.addListener(
      "FRIEND-REQUEST-UPDATE-EVENT",
      () => {
        // getAllConversations();
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

  const getAllConversations = () => {

    db.transaction((tx) => {
      tx.executeSql(
        "select t.id as id,t.user_id_from as userIdFrom,t.username_from as usernameFrom,t.avatar_from as avatarFrom,t.user_id_to as userIdTo,t.username_to as usernameTo,t.avatar_to as avatarTo,msg.message as lastMessage,msg.username_from as lastMessageFrom,msg.timestamp as lastMessageTimestamp from (select c.id,c.avatar_from,c.avatar_to,c.user_id_from,c.user_id_to,c.username_from,c.username_to,coalesce(max(m.id),0) msg_id from conversation c left join message m on c.id = m.conversation_id where c.user_id_from = ? group by c.id,c.avatar_from,c.avatar_to) t left join message msg on t.msg_id = msg.id",
        [user.id],
        (txObj, resultSet: any) => {
          console.log(">>>>>> inside chat component", resultSet);
          setConversations(resultSet.rows._array);
          setLoading(false);
          setlistLoading(false);
        },
        (txObj, error: any) => {
          console.log(error);
          return error;
        }
      );
    });
  };

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
          <InputField
            placeholder="Search"
            width="100%"
            onKeyPress={(e: any) => {}}
          />
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
