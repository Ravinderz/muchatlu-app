import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,

  View
} from "react-native";
import IMAGES from "../assets/index.js";
import { AuthContext } from "../Providers/AuthProvider";

const UserProfile = ({ route }: any) => {
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    setLoading(false);
  }, []);

  let temp = user.avatar.split("/");
  let name = temp[temp.length - 1].split(".")[0];
  const imgSrc = IMAGES[name];
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <View style={styles.container}>
          <Image style={styles.avatar} source={imgSrc} />
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.status}>{user.status}</Text>
          <Text style={styles.status}>
            {user.isOnline ? "Online" : "Offline"}
          </Text>
        </View>
      )}
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    // justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop: 50,
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
