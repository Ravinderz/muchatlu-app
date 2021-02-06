import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  DeviceEventEmitter,
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { URI } from "../constants";
import InputField from "./inputField";

const GifKeyboardView = () => {
  const [trendingGifs, setTrendingGifs] = useState([]);
  const [searchedGifs, setSearchedGifs] = useState([]);
  const [data, setData] = useState([]);
  const [nextPos, setNextPos] = useState();
  const [nextSearchPos, setNextSearchPos] = useState();
  const [refreshingList, setRefreshingList] = useState(false);
  const [typing, setTyping] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [timeOutObj, setTimeoutObj] = useState();

  useEffect(() => {
    getTrendingGifs();
    return () => {};
  }, []);

  const searchGifs = async (text: string) => {
    setRefreshingList(true);
    let sameSearch = false;
    let url = URI.searchGifs;
    url = url + text;
    if (searchText === text) {
      sameSearch = true;
      if (nextSearchPos) {
        url = `${url}&pos=${nextSearchPos}`;
      }
    }
    try {
      let response = await fetch(`${url}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      let json = await response.json();
      setNextSearchPos(json.next);

      if (sameSearch && searchedGifs.length !== 0) {
        let obj: any = [...searchedGifs, ...json.results];
        setSearchedGifs(obj);
        setData(obj);
      } else {
        setSearchedGifs(json.results);
        setData(json.results);
      }

      setRefreshingList(false);
    } catch (error) {
      console.error(error);
    }
  };

  const getTrendingGifs = async () => {
    setRefreshingList(true);
    let url = URI.topTrendingGifs;
    if (nextPos) {
      url = `${url}+&pos=${nextPos}`;
    }

    try {
      let response = await fetch(`${url}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      let json = await response.json();
      setNextPos(json.next);
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>", json.results.length);
      if (trendingGifs.length !== 0) {
        let obj: any = [...trendingGifs, ...json.results];
        setTrendingGifs(obj);
        setData(obj);
      } else {
        setTrendingGifs(json.results);
        setData(json.results);
      }

      setRefreshingList(false);
    } catch (error) {
      console.error(error);
    }
  };

  const selectedGif = (item: any) => {
    DeviceEventEmitter.emit("SELECTED-GIF", {
      text: item.media[0].gif.url,
      type: "image-url",
    });
  };

  // let timeOutObj:any;

  const onTyping = (text: string) => {
    clearTimeout(timeOutObj);
    let obj: any = setTimeout(() => {
      if (text && text.trim() && text.trim().length !== 0) {
        searchGifs(text);
      } else {
        setData(trendingGifs);
        setSearchedGifs([]);
      }
    }, 500);
    setTimeoutObj(obj);
  };

  const refreshList = () => {
    if (searchText) {
      searchGifs(searchText);
    } else {
      getTrendingGifs();
    }
  };

  const renderGif = ({ item }: any) => {
    return (
      <View style={{ marginRight: 10, marginBottom: 10 }}>
        <TouchableOpacity
          onPress={() => {
            selectedGif(item);
          }}
        >
          <Image
            style={{ height: 175, width: 175 }}
            source={{
              uri: item.media[0].tinygif.url,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const modalView = () => {
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          padding: 10,
          backgroundColor: "#b0b0b0",
        }}
      >
        <InputField
          placeholder="Search"
          width="100%"
          value={searchText}
          onChangeText={(text: string) => {
            setSearchText(text), onTyping(text);
          }}
        />
        <View style={{ justifyContent: "space-evenly" }}>
          <FlatList
            horizontal={false}
            numColumns={2}
            data={data}
            keyExtractor={(item: any) => item.id.toString()}
            renderItem={renderGif}
            onEndReachedThreshold={0.8}
            onEndReached={({ distanceFromEnd }) => {
              // problem
              refreshList();
            }}
          />
        </View>
        {refreshingList ? (
          <ActivityIndicator size="large" color="#6159E6" />
        ) : (
          <></>
        )}
      </View>
    );
  };

  return <View style={styles.container}>{modalView()}</View>;
};

export default GifKeyboardView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
