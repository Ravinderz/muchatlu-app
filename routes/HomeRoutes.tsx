import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import ChatHeader from "../components/chatHeader";
import MainHeader from "../components/mainHeader";
import Conversation from "../screens/conversation";
import Profile from "../screens/profile";
import Test from "../screens/test";
import Chat from "./../screens/chat";
import FriendRequest from "./../screens/friend-requests";
import Friend from "./../screens/friends";


interface HomeRoutesProps {}

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

function HomeStack() {
  return (
    <Tab.Navigator  tabBarOptions={{
      activeTintColor:"#6159E6",
      inactiveTintColor :"#bfbfbf",
      labelStyle: { fontWeight:"700"},
      indicatorStyle:{backgroundColor:"#6159E6"}
    }}>
      <Tab.Screen name="Chats" component={Chat} />
      <Tab.Screen name="Friends" component={Friend} />
      <Tab.Screen name="Friend Requests" component={FriendRequest} />
    </Tab.Navigator>
  );
}

export const HomeRoutes: React.FC<HomeRoutesProps> = ({}) => {
  return (
    <Stack.Navigator headerMode="screen" initialRouteName="Test">
      <Stack.Screen
        name="Home"
        component={HomeStack}
        options={{ headerTitle: props  => <MainHeader {...props}/> }}
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
       <Stack.Screen
        name="Test"
        component={Test}
        options={{ title: "Friend Profile", headerShown: true }}
      />
    </Stack.Navigator>
  );
};
