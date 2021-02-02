import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useEffect, useState } from "react";
import {
  DeviceEventEmitter,
  FlatList,
  StyleSheet,
  View
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import InputField from "../components/inputField";
import ListItem from "../components/ListItem";
import ListItemSkeleton from "../components/ListItemSkeleton";
import { AuthContext } from "../Providers/AuthProvider";
import { URI } from './../constants';

const getFriends = async (user: any, setLoading: any, setFriends: any, refreshToken:any) => {
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
    if(json.message === "JWT token Expired"){
      setLoading(true);
      refreshToken(user).then((value:any) => {
        getFriends(user, setLoading, setFriends,refreshToken);
      });
    }
    setFriends(json.friends);
    setLoading(false);
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

const Friend = ({ navigation }: any) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const { user, refreshToken } = useContext(AuthContext);


  const friendRequestEvent = DeviceEventEmitter.addListener("FRIEND-REQUEST-UPDATE-EVENT", () => {
    getFriends(user, setLoading, setFriends,refreshToken);
  });

  useEffect(() => {
    getFriends(user, setLoading, setFriends,refreshToken);
    return () => {
      friendRequestEvent.remove();
    }
  }, []);

  const filterFriends = async (text:string) => {

    console.log(text);

    if(!text && text.trim() === ""){
      getFriends(user, setLoading, setFriends, refreshToken);
      return;
    }
    let tokenObj = await AsyncStorage.getItem("token");
    let storedToken = null;
    if (tokenObj !== null) {
      storedToken = JSON.parse(tokenObj);
    }
    try {
      let response = await fetch(
        `${URI.filterFriends}/${user.id}/${text}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken.token}`,
          },
        }
      );
  
      let json = await response.json();      
      console.log("friend json",json)
      if(json.message === "JWT token Expired"){
        setLoading(true);
        refreshToken(user).then(() => {
          console.log("before the action value caasdf")
          filterFriends(text); 
        });
      }
      setFriends(json);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      {loading ? (
        skeletonLoading()
        // <ActivityIndicator/>
      ) : (
        <View>
          <InputField placeholder="Search" width="100%"  onChangeText={(text:string) => {setText(text),filterFriends(text)}}
            value={text} />
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
