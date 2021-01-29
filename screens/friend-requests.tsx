import { MaterialIcons } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  AsyncStorage, DeviceEventEmitter, FlatList,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import InputField from "../components/inputField";
import ListItem from "../components/ListItem";
import { AuthContext } from "../Providers/AuthProvider";

const getFriendRequests = async (
  user: any,
  setLoading: any,
  setFriendRequests: any
) => {
  let tokenObj = await AsyncStorage.getItem("token");
  let storedToken = null;
  if (tokenObj !== null) {
    storedToken = JSON.parse(tokenObj);
  }

  try {
    let response = await fetch(
      `http://192.168.0.103:8080/getFriendRequests/${user.id}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken.token}`,
        },
      }
    );

    let json = await response.json();
    setFriendRequests(json);
    setLoading(false);
  } catch (error) {
    console.error(error);
  }
};

const FriendRequest = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [text, setText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const friendRequestEvent = DeviceEventEmitter.addListener("FRIEND-REQUEST-UPDATE-EVENT", () => {
    getFriendRequests(user, setLoading, setFriendRequests);
  });

  const getUserDetails = async (email: string, storedToken: any) => {
    try {
      let response = await fetch(
        `http://192.168.0.103:8080/getUserDetails/${email}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken.token}`,
          },
        }
      );

      let json = await response.json();
      return json;
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  };

  const sendFriendRequest = async (text: string) => {
    let tokenObj = await AsyncStorage.getItem("token");
    let storedToken = null;
    if (tokenObj !== null) {
      storedToken = JSON.parse(tokenObj);
    }

    if (text === friendRequests[friendRequests.length - 1]) {
      return;
    }

    if (text === user.email) {
      setErrorMessage("Friend request can't be sent to self");
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      return;
    }

    let toUser = await getUserDetails(text, storedToken);
    if (toUser && toUser.id) {
      let friendRequest = {
        status: "Pending",
        requestFromUserId: user.id,
        requestToEmailId: text,
        requestFromUsername: user.username,
        requestToUsername: toUser.username,
        requestToUserId: toUser.id,
        avatarTo: toUser.avatar,
        avatarFrom: user.avatar,
      };
      console.log(friendRequest);

      try {
        let response = await fetch(
          `http://192.168.0.103:8080/sendFriendRequest`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${storedToken.token}`,
            },
            body: JSON.stringify(friendRequest),
          }
        );

        let json = await response.json();
        if (json) {
          //this.message = `Friend Request to ${value.username} sent successfully`;
          //console.log(request);
          getFriendRequests(user, setLoading, setFriendRequests);
          setText("");
        }
        return json;
      } catch (error) {
        console.error(error);
        setErrorMessage(error.message);
      }
    } else {
      setErrorMessage("User doesn't exist");
    }
  };

  useEffect(() => {
    getFriendRequests(user, setLoading, setFriendRequests);

    return () => {
      friendRequestEvent.remove();
    }
  }, []);

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <InputField
              placeholder="Search"
              width="88%"
              value={text}
              onChangeText={setText}
            />
            <TouchableOpacity
              style={{
                marginLeft: 5,
              }}
              onPress={() => sendFriendRequest(text)}
            >
              <MaterialIcons name="add-circle" size={40} color="#6159E6" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={friendRequests}
            keyExtractor={(item: any) => item.id.toString()}
            renderItem={({ item }: any) => (
              <ListItem item={item} listType={"friendRequests"} />
            )}
          />
        </View>
      )}
    </View>
  );
};

export default FriendRequest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
