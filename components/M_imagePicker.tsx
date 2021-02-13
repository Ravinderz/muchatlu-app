import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { DeviceEventEmitter, Platform } from "react-native";

const MImagePicker = (props: any) => {
  const navigation = props.navigation;
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();

    const pickImageEvent = DeviceEventEmitter.addListener(
      "PICK-IMAGE",
      (value: any) => {
        pickImage();
      }
    );
    return () => {
      pickImageEvent.remove();
    };
  }, []);

  const pickImage = async () => {
    let result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      // aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      navigation.navigate("selectedImage", {
        img: `data:image/png;base64,${result.base64}`,
        type: "image",
        data: result.base64,
        event: "SELECTED-IMAGE",
      });
    }
  };

  return <></>;
};

export default MImagePicker;
