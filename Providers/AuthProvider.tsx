import React, { useState } from "react";
import { AsyncStorage } from "react-native";
import { URI } from './../constants';

export type User = null | {
  id: number;
  username: string;
  email: string;
  avatar: string;
  isOnline: boolean;
  status: string;
};

export const AuthContext = React.createContext<{
  user: User;
  headerItem: any;
  login: (email: string, password: string) => void;
  logout: (userId: number) => void;
  setHeaderItem: (item: any) => void;
  
}>({
  user: null,
  headerItem: null,
  login: () => {},
  logout: () => {},
  setHeaderItem:() => {}

});

interface AuthProviderProps {}

const authenticate = async (email:string,password:string) => {
  console.log("calling authenticate");
  try {
    let response = await fetch(URI.authenticate, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    let json = await response.json();
    AsyncStorage.setItem("token", JSON.stringify(json));
  } catch (error) {
    console.error(error);
  }
};

const login = async (email: string, password: string) => {
  let tokenObj  = await AsyncStorage.getItem("token");
  let storedToken = null;
  if(tokenObj !== null){
    storedToken = JSON.parse(tokenObj);
  }

  try {
    let response = await fetch(URI.login, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken.token}`,
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    let json: User = await response.json();
    AsyncStorage.setItem("user", JSON.stringify(json));
    return json;
  } catch (error) {
    console.error(error);
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [headerItem, setHeaderItem] = useState<any>(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        headerItem,
        login: (email, password) => {
          authenticate(email,password).then((token) => {
            login(email,password).then((value:any) => {
                setUser(value);
              });
          });
        },
        logout: () => {
          AsyncStorage.removeItem("user");
        },
        setHeaderItem: (item:any) => {
          setHeaderItem(item);
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
