import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,

  TouchableOpacity, View
} from "react-native";
import { AuthContext } from "../Providers/AuthProvider";
import IMAGES from "./../assets/index.js";

const Profile = ({route}:any) => {

  
  const item = route.params.item;
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    setLoading(false);
  }, [])

  
    let temp = item.avatar.split("/");
    let name = temp[temp.length - 1].split(".")[0];
    const imgSrc = IMAGES[name];
    return (
      <View style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <View style={styles.container}>
            <Image style={styles.avatar} source={imgSrc} />
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.email}>{item.email}</Text>
            <Text style={styles.status}>{item.status}</Text>
            <Text style={styles.status}>
              {item.isOnline ? "Online" : "Offline"}
            </Text>
            <TouchableOpacity style={styles.btnPrimary}>
              <Text style={{ color: "#FFF", fontWeight:"600" }}>Start Chat</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
}

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    // justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop:50
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    padding: 10,
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    marginBottom: 5,
  },
  status: {
    fontSize: 16,
    marginBottom: 5,
  },
  btnPrimary: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#6159E6",
    justifyContent: "center",
    alignItems: "center",
    width: "40%",
    height: 40,
    borderRadius: 35,
  },
});
