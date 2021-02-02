import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { DeviceEventEmitter } from "react-native";
import { URI } from "./../constants";

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
  logout: () => void;
  refreshToken: (user: User) => any;
  setHeaderItem: (item: any) => void;
}>({
  user: null,
  headerItem: null,
  login: () => {},
  logout: () => {},
  refreshToken: () => {},
  setHeaderItem: () => {},
});

interface AuthProviderProps {}

const authenticate = async (email: string, password: string) => {
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

const refreshToken = async (user: User) => {
  let tokenObj = await AsyncStorage.getItem("token");
  let storedToken = null;
  if (tokenObj !== null) {
    storedToken = JSON.parse(tokenObj);
  }

  try {
    let response = await fetch(`${URI.refreshToken}/${user.email}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken.refreshToken}`,
      },
    });

    let json = await response.json();
    storedToken.token = json.token;
    await AsyncStorage.removeItem("token");
    await AsyncStorage.setItem("token", JSON.stringify(storedToken));
    return "Completed";
  } catch (error) {
    console.error(error);
  }
};

const login = async (email: string, password: string) => {
  let tokenObj = await AsyncStorage.getItem("token");
  let storedToken = null;
  if (tokenObj !== null) {
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

const getUserFromStorage = async () => {
  let user = await AsyncStorage.getItem("user");
  let obj: User;
  if (user) {
    obj = JSON.parse(user);
    return obj;
  }
  return null;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [headerItem, setHeaderItem] = useState<any>(null);

  const logout = async () => {
    let tokenObj = await AsyncStorage.getItem("token");
    let storedToken = null;
    if (tokenObj !== null) {
      storedToken = JSON.parse(tokenObj);
    }

    try {
      let response = await fetch(URI.logout, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken.token}`,
          isRefreshToken: "true",
        },
        body: JSON.stringify(user),
      });

      let json: User = await response.json();
      if (json) {
        DeviceEventEmitter.emit("USER-LOGOUT-EVENT", true);
        AsyncStorage.clear();
        setUser(null);
      }
      return json;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserFromStorage().then((value:User) => {
      setUser(value);
    })
    return () => {};
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        headerItem,
        login: (email, password) => {
          authenticate(email, password).then((token) => {
            login(email, password).then((value: any) => {
              setUser(value);
            });
          });
        },
        logout: () => {
          logout();
        },
        refreshToken: (user) => {
          return refreshToken(user);
        },
        setHeaderItem: (item: any) => {
          setHeaderItem(item);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
