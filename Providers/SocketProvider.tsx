import React, { useContext, useEffect } from "react";
import { DeviceEventEmitter } from "react-native";
import SockJS from "sockjs-client"; // Note this line
import Stomp from "stompjs";
import { AuthContext } from "./AuthProvider";

export const SocketContext = React.createContext<{
  sendMessage: (message: any) => void;
}>({
  sendMessage: () => {},
});

interface SocketProviderProps {}

let stompClient: any;

const connect = (user: any) => {
  const serverUrl = `http://192.168.0.103:8080/chat?userId=${user.id}`;
  const ws = new SockJS(serverUrl);
  stompClient = Stomp.over(ws);

  // tslint:disable-next-line:only-arrow-functions

  stompClient.connect({ userId: `${user.id}` }, function (frame: any) {
    stompClient.subscribe(`/topic/${user.id}/messages`, (message: any) => {
      if (message.body) {
        let msg = JSON.parse(message.body);
        DeviceEventEmitter.emit("MESSAGE-EVENT", msg);
      }
    });

    stompClient.subscribe(
      `/topic/${user.id}/messages.typing`,
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

    stompClient.subscribe(`/topic/${user.id}.friendRequest`, (message: any) => {
      console.log(message);
      if (message.body) {
        let msg = JSON.parse(message.body);
        DeviceEventEmitter.emit("FRIEND_REQUEST-EVENT", msg);
      }
    });
  });
};

const sendMessage = (message: any) => {
  stompClient.send(
    `/app/chat.${message.userIdTo}`,
    {},
    JSON.stringify(message)
  );
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { user } = useContext(AuthContext);
  useEffect(() => {
    if (user) {
      connect(user);
    }
  }, [user]);

  return (
    <SocketContext.Provider
      value={{
        sendMessage: (message: any) => {
          sendMessage(message);
        },
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
