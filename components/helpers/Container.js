import React from "react";
import { View } from "react-native";
import { CONTAINER_MARGIN } from "./Variables";

const Container = ({ children }) => {
  return <View style={{ marginTop: CONTAINER_MARGIN }}>{children}</View>;
};

export default Container;
