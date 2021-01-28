import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  FlatList,
  StyleSheet,
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

  useEffect(() => {
    getFriendRequests(user, setLoading, setFriendRequests);
  }, []);

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <View>
          <InputField placeholder="Search" width="100%" />
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
