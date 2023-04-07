import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import LogOutNavigation from "./LogOutNavigation";
import MainNavigation from "./MainNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";

const Navigation = () => {
  const token = useSelector((state) => state.loginSlice.token);
  const [accesToken, setAccesToken] = useState("");
  useEffect(() => {
    const getToken = async () => {
      try {
        AsyncStorage.getItem("token").then((value) => {
          if (value) {
            setAccesToken(value);
          } else {
            setAccesToken("");
          }
        });
      } catch (error) {
        return error
      }
    };
    getToken();
  }, []);

  return (
    <NavigationContainer>
      {accesToken || token ? <MainNavigation /> : <LogOutNavigation />}
    </NavigationContainer>
  );
};

export default Navigation;
