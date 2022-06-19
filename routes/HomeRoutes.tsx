import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import ChatHeader from "../components/chatHeader";
import ImgViewHeader from "../components/imgViewHeader";
import MainHeader from "../components/mainHeader";
import Conversation from "../screens/conversation";
import Profile from "../screens/profile";
import SelectedImageView from "../screens/selected-image-view";
import UserProfile from "../screens/user-profile";
import Chat from "./../screens/chat";
import FriendRequest from "./../screens/friend-requests";
import Friend from "./../screens/friends";
import MImageView from "./../screens/image-view";

interface HomeRoutesProps { }

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

function HomeStack() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#6159E6",
        tabBarInactiveTintColor: "#bfbfbf",
        tabBarLabelStyle: { fontWeight: "700" },
        tabBarIndicatorStyle: { backgroundColor: "#6159E6" },
      }}
    >
      <Tab.Screen name="Chats" component={Chat} />
      <Tab.Screen name="Friends" component={Friend} />
      <Tab.Screen name="Friend Requests" component={FriendRequest} />
    </Tab.Navigator>
  );
}

export const HomeRoutes: React.FC<HomeRoutesProps> = ({ }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeStack}
        options={({ navigation, route }) => ({
          headerTitle: (props) => (
            <MainHeader {...props} navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="Conversation"
        component={Conversation}
        options={({ navigation }) => ({
          headerTitle: (props) => (
            <ChatHeader {...props} navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="ImageView"
        component={MImageView}
        options={({ route }) => ({
          headerTitle: (props) => <ImgViewHeader {...props} route={route} />,
        })}
      />
      <Stack.Screen
        name="selectedImage"
        component={SelectedImageView}
        options={{ title: "", headerShown: true }}
      />
      <Stack.Screen
        name="FriendProfile"
        component={Profile}
        options={{ title: "Friend Profile", headerShown: true }}
      />
      <Stack.Screen
        name="userProfile"
        component={UserProfile}
        options={{ title: "Profile", headerShown: true }}
      />
      <Stack.Screen
        name="FriendRequestDetail"
        component={Profile}
        options={{ title: "Friend Profile", headerShown: true }}
      />
    </Stack.Navigator>
  );
};
