import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { AuthParamList } from "../params/AuthParamList";
import Login from "./../screens/login";
import Register from "./../screens/register";
interface AuthRoutesProps {}

const Stack = createStackNavigator<AuthParamList>();

export const AuthRoutes: React.FC<AuthRoutesProps> = ({}) => {

  return (
    
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: "Sign In", headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ title: "Sign Up", headerShown: false }}
        />
      </Stack.Navigator>
    
  );
};
