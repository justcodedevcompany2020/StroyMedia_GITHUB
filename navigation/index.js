import React, {useEffect, useRef, useState} from "react";
import {NavigationContainer} from "@react-navigation/native";
import LogOutNavigation from "./LogOutNavigation";
import MainNavigation from "./MainNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useSelector} from "react-redux";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Navigation = () => {
  const token = useSelector((state) => state.loginSlice.token);
  const [accesToken, setAccesToken] = useState("");
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const state = useSelector((state) => state);
  const {notification_data} = state.getAllNotificationsSlice;

  // const sendNotification = async () => {
  //   // console.log(notification_data[0][0]);
  //   // console.log(`https://teus.online${notification_data[0][0].author.avatar}`);
  //
  //   await Notifications.scheduleNotificationAsync({
  //     content: {
  //       title: "You've got mail! 📬",
  //       sound: true, // Provide ONLY the base filename
  //       body: "namak es stacel",
  //       subtitle: "You ve got mail",
  //       vibrate: true,
  //       // launchImageName: `https://teus.online${notification_data[0][0].author.avatar}`,
  //       badge: 1,
  //     },
  //     trigger: {
  //       seconds: 2,
  //       channelId: "new-emails",
  //     },
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
        setExpoPushToken(token)
        console.log(token)
      }
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification, "notification");
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response, "response");
      });


    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  //   });

  // };

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
        return error;
      }
    };
    getToken();
  }, []);

  return (
    <NavigationContainer>
      {accesToken || token ? <MainNavigation/> : <LogOutNavigation/>}
    </NavigationContainer>
  );
};

export default Navigation;

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
      sound: true,
      enableVibrate: true,
      showBadge: true,
      audioAttributes: true,
    });
  }

  if (Device.isDevice) {
    const {status: existingStatus} = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const {status} = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(Notifications.getExpoPushTokenAsync())
    AsyncStorage.setItem('pushToken', token)
  } else {
    alert("Must use physical device for Push Notifications");
  }
  console.log(token)
  return token;
}
