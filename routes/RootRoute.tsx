import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useContext, useEffect, useState } from "react";
import { AsyncStorage } from "react-native";
import { AuthContext } from "../Providers/AuthProvider";
import { AuthRoutes } from "./AuthRoutes";
import { HomeRoutes } from "./HomeRoutes";

interface RootRouteProps {}

const Stack = createStackNavigator();

export const RootRoute: React.FC<RootRouteProps> = ({}) => {

    const [loading, setLoading] = useState(true);
    const {user}  = useContext(AuthContext);
  
    useEffect(() => {
      AsyncStorage.getItem('user').then( value => {
        if(value){
          setLoading(false);
        }else{
          setLoading(false);
        }
      })
    },[]);

  return (
    <NavigationContainer>
       {user ? <HomeRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
};
