import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
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
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeStack}
        options={{ title: "Home" }}
      />
    </Stack.Navigator>
  );
};
