import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ImageExit, ImageHelp, ImageUser } from "../helpers/images";
import { COLOR_1 } from "../helpers/Variables";
import HomeFooterButton from "./HomeFooterButton";
import LogOutModal from "./LogOutModal";
import { logout } from "../../store/reducers/loginSlice";
import { useDispatch } from "react-redux";
import { authRequest } from "../../store/reducers/authUserSlice";
import * as Updates from "expo-updates";

const HomeFooterButtons = ({ navigation }) => {
  const [showLogOutModal, setShowLogOutModal] = useState(false);
  const [token, setToken] = useState();
  const dispatch = useDispatch();
  useEffect(() => {
    AsyncStorage.getItem("token").then((result) => {
      setToken(result);
    });
  }, []);
  return (
    <View style={styles.wrapper}>
      <HomeFooterButton
        SvgImage={ImageUser}
        text={"Мой профиль"}
        onPress={() => {
          dispatch(authRequest({ token: token }));
          return navigation.navigate("MyProfile", {
            currentPage: "Мой профиль",
          });
        }}
      />
      <HomeFooterButton
        SvgImage={ImageHelp}
        text={"Помощь"}
        onPress={() => navigation.navigate("Help", { currentPage: "Помощь" })}
      />
      <HomeFooterButton
        SvgImage={ImageExit}
        text={"Выход"}
        onPress={() => setShowLogOutModal(true)}
      />
      <LogOutModal
        onSubmit={() => {
          dispatch(logout());
          return Updates.reloadAsync();
        }}
        onCancel={() => setShowLogOutModal(false)}
        isVisible={showLogOutModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    justifyContent: "space-evenly",
    flexDirection: "row",
    marginTop: 50,
  },
  block: {
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
    height: 100,
  },
  image: {
    height: 50,
    resizeMode: "contain",
  },
  text: {
    marginBottom: 16,
    marginTop: 16,
    fontSize: 10,
    fontFamily: "GothamProMedium",
    color: COLOR_1,
  },
});

export default HomeFooterButtons;
