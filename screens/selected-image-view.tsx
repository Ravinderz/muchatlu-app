import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { DeviceEventEmitter, Image, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const SelectedImageView = ({ navigation, route }: any) => {
  const img = route.params.img;
  const type = route.params.type;
  const event = route.params.event;
  const data = route.params.data;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => { };
  }, []);

  const sendMsg = () => {
    if (type === "image") {
      DeviceEventEmitter.emit("SELECTED-IMAGE", {
        text: "image",
        type: "image",
        data: data,
      });
    }

    if (type === "image-url") {
      DeviceEventEmitter.emit(event, {
        text: img,
        type: type,
      });
    }

    navigation.goBack();
  };

  return (
    <View
      style={{
        position: "relative",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        style={{ width: "100%", height: "100%", resizeMode: "contain" }}
        source={{
          uri: img,
        }}
      />
      <View
        style={{
          position: "absolute",
          left: "80%",
          top: "88%",
        }}
      >
        <TouchableOpacity onPress={() => sendMsg()}>
          <MaterialCommunityIcons
            name="send-circle"
            size={60}
            color="#6159E6"
            style={{ padding: 8 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SelectedImageView;
