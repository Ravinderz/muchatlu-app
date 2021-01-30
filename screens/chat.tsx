import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  DeviceEventEmitter,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import InputField from "../components/inputField";
import ListItem from "../components/ListItem";
import { AuthContext } from "../Providers/AuthProvider";
import { URI } from './../constants';

const Chat = ({ navigation }: any) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, setHeaderItem } = useContext(AuthContext);

  const friendRequestEvent = DeviceEventEmitter.addListener("FRIEND-REQUEST-UPDATE-EVENT", () => {
    getConversations();

   
  });

  useEffect(() => {
    getConversations();

    return () => {
      friendRequestEvent.remove();
    }
  }, []);

  const getConversations = async () => {
    let tokenObj = await AsyncStorage.getItem("token");
    let storedToken = null;
    if (tokenObj !== null) {
      storedToken = JSON.parse(tokenObj);
    }

    try {
      let response = await fetch(
        `${URI.getConversations}/${user.id}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken.token}`,
          },
        }
      );

      let json = await response.json();
      setConversations(json);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <View>
          <InputField placeholder="Search" width="100%" />
          <FlatList
            data={conversations}
            keyExtractor={(item: any) => item.id.toString()}
            renderItem={({ item }: any) => (
              <TouchableOpacity
                onPress={() => {
                  setHeaderItem(item);
                  navigation.navigate("Conversation", { item: item, typingItem:{
                    userIdFrom: "",
                    userIdTo: "",
                    isTyping: false,
                    conversationId: item.id,
                  } });
                }}
              >
                <ListItem item={item} listType={"chats"} />
              </TouchableOpacity>
            )}
          />
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
