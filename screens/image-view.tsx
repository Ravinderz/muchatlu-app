import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";

const MImageView = ({ navigation, route }: any) => {
  const img = route.params.img;
  const data = route.params.data;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image
      style={{width:"100%",height:"100%", resizeMode:"contain"}}
        source={{
          uri: img,
        }}
      />
    </View>
  );
};

export default MImageView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
