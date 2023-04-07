import { StatusBar } from "expo-status-bar";
import React from "react";
import Navigation from "./navigation";
import { connectFonts } from "./components/helpers/connectFonts";
import { useFonts } from "expo-font";
import { Provider } from "react-redux";
import FlashMessage from "react-native-flash-message";
import { store } from "./store/index";
import "./ignoreWarnings";
export default function App() {
  const [loaded] = connectFonts(useFonts);
  if (!loaded) return null;

  return (
    <Provider store={store}>
      <Navigation />
      <StatusBar style="auto" backgroundColor={"white"} />
      <FlashMessage position="bottom" />
    </Provider>
  );
}
