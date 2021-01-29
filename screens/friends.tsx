import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  DeviceEventEmitter,
  FlatList,
  StyleSheet,
  View
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import InputField from "../components/inputField";
import ListItem from "../components/ListItem";
import { AuthContext } from "../Providers/AuthProvider";
import { URI } from './../constants';

const getFriends = async (user: any, setLoading: any, setFriends: any) => {
  let tokenObj = await AsyncStorage.getItem("token");
  let storedToken = null;
  if (tokenObj !== null) {
    storedToken = JSON.parse(tokenObj);
  }
  try {
    let response = await fetch(
      `${URI.getFriends}/${user.id}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken.token}`,
        },
      }
    );

    let json = await response.json();
    setFriends(json.friends);
    setLoading(false);
  } catch (error) {
    console.error(error);
  }
};

const Friend = ({ navigation }: any) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const friendRequestEvent = DeviceEventEmitter.addListener("FRIEND-REQUEST-UPDATE-EVENT", () => {
    getFriends(user, setLoading, setFriends);
  });

  useEffect(() => {
    getFriends(user, setLoading, setFriends);

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
          <InputField placeholder="Search" width="100%" />
          <FlatList
            data={friends}
            keyExtractor={(item: any) => item.id.toString()}
            renderItem={({ item }: any) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("FriendProfile", { item: item });
                }}
              >
                <ListItem item={item} listType={"friends"} />
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default Friend;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
