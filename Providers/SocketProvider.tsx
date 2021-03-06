import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as SQLite from "expo-sqlite";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AppState, DeviceEventEmitter, Platform } from "react-native";
import SockJS from "sockjs-client"; // Note this line
import Stomp from "stompjs";
// import { LOG } from "./../components/logger";
import { URI } from "./../constants";
import { initializeDB } from "./../db/schemas";
import { AuthContext } from "./AuthProvider";

const db = SQLite.openDatabase("muchatlu.db");

export const SocketContext = React.createContext<{
  incomingMessage: any;
  unreadconversationsMessagesCount: any;
  sendMessage: (message: any) => void;
  isTyping: (message: any) => void;
  setActiveConversationId: (id: string) => void;
  setUnreadconversationsMessagesCount: (obj: any) => void;
}>({
  incomingMessage: null,
  unreadconversationsMessagesCount: null,
  setActiveConversationId: () => {},
  setUnreadconversationsMessagesCount: () => {},
  sendMessage: () => {},
  isTyping: () => {},
});

interface SocketProviderProps {}

let stompClient: any;
let isConnected = false;
let conversationId = "";
let _appState: string = "background";
let Conversations = {};

const registerForPushNotificationsAsync = async () => {
  let token;
  if (Constants.isDevice) {
    const {
      status: existingStatus,
    } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
};

const getConversationId = (obj:any) => {
  db.transaction((tx) => {
    tx.executeSql(
      "select id from conversation where user_id_from = ? and user_id_to = ?",
      [
        obj.userIdTo,
        obj.userIdFrom
      ],
      (txObj, resultSet) => {
        console.log("convo id data result set ", resultSet);
      },
      (txObj, error:any) => {
        console.log(error);
        return error;
      }
    );
  });
}

const allSubscriptions = (
  id: number,
  unreadconversationsMessagesCount: any,
  setUnreadconversationsMessagesCount: any
) => {
  stompClient.subscribe(`/topic/${id}/messages`, (message: any) => {
    if (message.body) {
      let msg = JSON.parse(message.body);
      //setIncomingMessage(msg);

      // insertMessage(msg);
      DeviceEventEmitter.emit("MESSAGE-EVENT", msg);
      
      let content = {
        title: `${msg.usernameFrom}`,
        body: `${msg.message}`,
        data: msg,
      };
      if (conversationId !== msg.conversationId) {
        if (_appState === "active") {
          triggerNotification(content);
        }

        let obj: any = unreadconversationsMessagesCount;
        if (!obj) {
          obj = {};
        }

        if (!unreadconversationsMessagesCount[msg.conversationId]) {
          obj[msg.conversationId] = 1;
        } else {
          obj[msg.conversationId] =
            unreadconversationsMessagesCount[msg.conversationId] + 1;
        }

        setUnreadconversationsMessagesCount(obj);
      }
    }
  });

  stompClient.subscribe(`/topic/${id}/messages.typing`, (message: any) => {
    if (message.body) {
      let msg = JSON.parse(message.body);
      DeviceEventEmitter.emit("TYPING-EVENT", msg);
    }
  });

  stompClient.subscribe(`/topic/public.login`, (message: any) => {
    if (message.body) {
      let msg = JSON.parse(message.body);
      console.log("login event fired");
      DeviceEventEmitter.emit("LOGIN-EVENT", msg);
    }
  });

  stompClient.subscribe(`/topic/public.logout`, (message: any) => {
    if (message.body) {
      let msg = JSON.parse(message.body);
      console.log("logout event fired");
      DeviceEventEmitter.emit("LOGOUT-EVENT", msg);
    }
  });

  stompClient.subscribe(`/topic/${id}.friendRequest`, (message: any) => {
    if (message.body) {
      let msg = JSON.parse(message.body);
      DeviceEventEmitter.emit("FRIEND-REQUEST-UPDATE-EVENT", msg);
    }
  });
};

const connect = (
  user: any,
  unreadconversationsMessagesCount: any,
  setUnreadconversationsMessagesCount: any
) => {
  const serverUrl = `${URI.socketConnect}?userId=${user.id}`;
  const ws = new SockJS(serverUrl);

  console.log("socket is connected ::: ", isConnected);

  // LOG.info("socket is connected ::: ",isConnected)

  stompClient = Stomp.over(ws);
  stompClient.connect({ userId: `${user.id}` }, function (frame: any) {
    isConnected = true;
    allSubscriptions(
      user.id,
      unreadconversationsMessagesCount,
      setUnreadconversationsMessagesCount
    );
  });
  // }
};

const sendMessage = (message: any) => {
  stompClient.send(
    `/app/chat.${message.userIdTo}`,
    {},
    JSON.stringify(message)
  );
};

const isTyping = (message: any) => {
  stompClient.send(
    `/app/chat.typing.${message.userIdTo}`,
    {},
    JSON.stringify(message)
  );
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const triggerNotification = async (content: any) => {
  await Notifications.scheduleNotificationAsync({
    content: content,
    trigger: null,
  });
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [notification, setNotification] = useState({});
  const [expoPushToken, setExpoPushToken] = useState("");
  const [appState, setAppState] = useState("background");
  const [incomingMessage, setIncomingMessage] = useState({});
  const [
    unreadconversationsMessagesCount,
    setUnreadconversationsMessagesCount,
  ] = useState({});
  const notificationListener = useRef();

  useEffect(() => {
    if (user) {
      connect(
        user,
        unreadconversationsMessagesCount,
        setUnreadconversationsMessagesCount
      );
      registerForPushNotificationsAsync().then((token: any) => {
        setExpoPushToken(token);
        updateUserPushToken(token);
      });

      initializeDB();
    }

    AppState.addEventListener("change", (value: any) => {
      if (appState.match("background") && value === "active") {
        updateUserPresence(true);
        setAppState("active");
        _appState = "active";
      }
      if (
        appState.match("active") &&
        (value === "inactive" || value === "background")
      ) {
        updateUserPresence(false);
        setAppState("background");
        _appState = "background";
      }
    });

    const userLogoutEvent = DeviceEventEmitter.addListener(
      "USER-LOGOUT-EVENT",
      (value: boolean) => {
        if (stompClient) {
          stompClient.disconnect();
        }
      }
    );

    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );
    return () => {
      userLogoutEvent.remove();
      AppState.removeEventListener("change", (value) => {
        console.log("appstate event removed");
      });
    };
  }, [user]);

  const updateUserPresence = async (status: boolean) => {
    let tokenObj = await AsyncStorage.getItem("token");
    let storedToken = null;
    if (tokenObj !== null) {
      storedToken = JSON.parse(tokenObj);
    }

    let user = await AsyncStorage.getItem("user");
    if (user !== null) {
      let obj = { id: JSON.parse(user).id, isOnline: status };
      try {
        let response = await fetch(`${URI.updateUserPresence}`, {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken.token}`,
          },
          body: JSON.stringify(obj),
        });

        let json = await response.json();
        console.log(json);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const updateUserPushToken = async (token: string) => {
    let tokenObj = await AsyncStorage.getItem("token");
    let storedToken = null;
    if (tokenObj !== null) {
      storedToken = JSON.parse(tokenObj);
    }

    let obj = { id: user.id, userPushToken: token };
    try {
      let response = await fetch(`${URI.updateUserPushToken}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken.token}`,
        },
        body: JSON.stringify(obj),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        incomingMessage,
        unreadconversationsMessagesCount,
        setActiveConversationId: (id: string) => {
          conversationId = id;
        },
        sendMessage: (message: any) => {
          sendMessage(message);
        },
        isTyping: (message: any) => {
          isTyping(message);
        },
        setUnreadconversationsMessagesCount: (obj: any) => {
          setUnreadconversationsMessagesCount(obj);
        },
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
