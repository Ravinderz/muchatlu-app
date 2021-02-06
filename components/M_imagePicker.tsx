import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { DeviceEventEmitter, Platform } from 'react-native';

const MImagePicker = () => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();

    const pickImageEvent = DeviceEventEmitter.addListener("PICK-IMAGE",(value:any) => {
      console.log('>>>>>> event received');
      pickImage();
    });
    return () => {
      pickImageEvent.remove();
    };
  }, []);

  const pickImage = async () => {
    console.log('>>>>>> event pick image');
    let result:any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      // aspect: [4, 3],
      quality: 0.5,
      base64:true,
    });

    DeviceEventEmitter.emit('SELECTED-IMAGE',{
      text: 'image',
      type: "image",
      data: result.base64
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
      <></>
  );

  
}

export default MImagePicker;