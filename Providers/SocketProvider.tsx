import * as Notifications from 'expo-notifications';
import React, { useContext, useEffect, useRef, useState } from "react";
import { DeviceEventEmitter } from "react-native";
import SockJS from "sockjs-client"; // Note this line
import Stomp from "stompjs";
// import { LOG } from "./../components/logger";
import { URI } from "./../constants";
import { AuthContext } from "./AuthProvider";

export const SocketContext = React.createContext<{
  sendMessage: (message: any) => void;
  isTyping: (message: any) => void;
  setActiveConversationId: (id:string) => void;
}>({
  setActiveConversationId: () => {},
  sendMessage: () => {},
  isTyping: () => {},
});

interface SocketProviderProps {}

let stompClient: any;
let isConnected = false;
let conversationId ='';

console.log(stompClient)
// LOG.info("stompCLient :: ",stompClient);

const userLogoutEvent = DeviceEventEmitter.addListener(
  "USER-LOGOUT-EVENT",
  (value:boolean) => {
    console.log("before logout");
    if(stompClient){
      stompClient.disconnect();
    }
  }
);

const allSubscriptions = (id:number) => {
  stompClient.subscribe(`/topic/${id}/messages`, (message: any) => {
    if (message.body) {
      let msg = JSON.parse(message.body);
      DeviceEventEmitter.emit("MESSAGE-EVENT", msg);
      let content = {
        title: `Message from ${msg.usernameFrom}`,
        body: `${msg.usernameFrom}: ${msg.message}`,
        data: {},
      }
      if(conversationId !== msg.conversationId){
        triggerNotification(content);
      }
      
    }
  });

  stompClient.subscribe(
    `/topic/${id}/messages.typing`,
    (message: any) => {
      if (message.body) {
        let msg = JSON.parse(message.body);
        DeviceEventEmitter.emit("TYPING-EVENT", msg);
      }
    }
  );

  stompClient.subscribe(`/topic/public.login`, (message: any) => {
    if (message.body) {
      let msg = JSON.parse(message.body);
      DeviceEventEmitter.emit("LOGIN-EVENT", msg);
    }
  });

  stompClient.subscribe(`/topic/public.logout`, (message: any) => {
    if (message.body) {
      let msg = JSON.parse(message.body);
      DeviceEventEmitter.emit("LOGOUT-EVENT", msg);
    }
  });

  stompClient.subscribe(`/topic/${id}.friendRequest`, (message: any) => {
    if (message.body) {
      let msg = JSON.parse(message.body);
      DeviceEventEmitter.emit("FRIEND-REQUEST-UPDATE-EVENT", msg);
    }
  });
}


const connect = (user: any) => {
  const serverUrl = `${URI.socketConnect}?userId=${user.id}`;
  const ws = new SockJS(serverUrl);
  
  console.log("socket is connected ::: ",isConnected)
  
  // LOG.info("socket is connected ::: ",isConnected)
  
    stompClient = Stomp.over(ws);    
    stompClient.connect({ userId: `${user.id}` }, function (frame: any) {
      isConnected = true;
      allSubscriptions(user.id);

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
}



export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [notification, setNotification] = useState({});
  const notificationListener = useRef();
  useEffect(() => {
    if (user) {
      connect(user);
    }
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });
  }, [user]);

  return (
    <SocketContext.Provider
      value={{        
        setActiveConversationId: (id:string) => {
          conversationId = id;
        },
        sendMessage: (message: any) => {
          sendMessage(message);
        },
        isTyping: (message: any) => {
          isTyping(message);
        },
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
