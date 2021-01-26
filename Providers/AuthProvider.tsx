import React, { useState } from "react";
import { AsyncStorage } from "react-native";

type User = null | {
  id: number;
  username: string;
  email: string;
  avatar: string;
  isOnline: boolean;
  status: string;
};

export const AuthContext = React.createContext<{
  user: User;
  login: (email: string, password: string) => void;
  logout: (userId: number) => void;
}>({
  user: null,
  login: () => {},
  logout: () => {},
});

interface AuthProviderProps {}

const authenticate = async (email:string,password:string) => {
  console.log("calling authenticate");
  try {
    let response = await fetch(`http://192.168.0.103:8080/authenticate`, {
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
    console.log("json", json);
    AsyncStorage.setItem("token", JSON.stringify(json));
  } catch (error) {
      console.log("inside catch error");
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
    let response = await fetch(`http://192.168.0.103:8080/login`, {
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

  return (
    <AuthContext.Provider
      value={{
        user,
        login: (email, password) => {
          console.log("inside login retyurn method", email);
          console.log(password);
          authenticate(email,password).then((token) => {
            login(email,password).then((value:any) => {
                console.log("valu", value);    
                setUser(value);
              });
          });
        },
        logout: () => {
          AsyncStorage.removeItem("user");
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
