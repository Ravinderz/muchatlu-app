import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  FlatList,
  StyleSheet,
  View
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import InputField from "../components/inputField";
import ListItem from "../components/ListItem";
import { AuthContext } from "../Providers/AuthProvider";

const getFriends = async (user: any, setLoading: any, setFriends: any) => {
  let tokenObj = await AsyncStorage.getItem("token");
  let storedToken = null;
  if (tokenObj !== null) {
    storedToken = JSON.parse(tokenObj);
  }
  try {
    let response = await fetch(
      `http://192.168.0.103:8080/getAllFriends/${user.id}`,
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

  useEffect(() => {
    getFriends(user, setLoading, setFriends);
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
            keyExtractor={(item:any) => item.id.toString()}
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
