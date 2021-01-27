import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import ChatHeader from "../components/chatHeader";
import Conversation from "../screens/conversation";
import Profile from "../screens/profile";
import Chat from "./../screens/chat";
import FriendRequest from "./../screens/friend-requests";
import Friend from "./../screens/friends";


interface HomeRoutesProps {}

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

function HomeStack() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Chats" component={Chat} />
      <Tab.Screen name="Friends" component={Friend} />
      <Tab.Screen name="Friend Requests" component={FriendRequest} />
    </Tab.Navigator>
  );
}

export const HomeRoutes: React.FC<HomeRoutesProps> = ({}) => {
  return (
    <Stack.Navigator headerMode="screen">
      <Stack.Screen
        name="Home"
        component={HomeStack}
        options={{ title: "Muchatlu" }}
      />
      <Stack.Screen
        name="Conversation"
        component={Conversation}
        options={{ headerTitle: props  => <ChatHeader {...props}/> }}
      />
      <Stack.Screen
        name="FriendProfile"
        component={Profile}
        options={{ title: "Friend Profile", headerShown: true }}
      />
      <Stack.Screen
        name="FriendRequestDetail"
        component={Profile}
        options={{ title: "Friend Profile", headerShown: true }}
      />
    </Stack.Navigator>
  );
};
