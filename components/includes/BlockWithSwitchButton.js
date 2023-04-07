import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
import { COLOR_2, COLOR_7, COLOR_9 } from "../helpers/Variables";
import ToggleSwitch from "toggle-switch-react-native";

class BlockWithSwitchButton extends Component {
  render() {
    const {
      title,
      description,
      isButton = true,
      titleStyle,
      style,
      isOn,
      onToggle,
      descriptionStyle,
    } = this.props;
    return (
      <View style={[styles.wrapper, style]}>
        <View style={styles.upRow}>
          <Text style={titleStyle}>{title}</Text>
          {isButton && (
            <ToggleSwitch
              isOn={isOn}
              onColor={COLOR_2}
              offColor={COLOR_7}
              size="medium"
              onToggle={onToggle}
              animationSpeed={200}
            />
          )}
        </View>
        {description && (
          <Text style={[styles.description, descriptionStyle]}>
            {description}
          </Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 10,
  },
  upRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  description: {
    color: COLOR_9,
    fontFamily: "GothamProRegular",
    fontSize: 9,
    marginTop: 8,
    lineHeight: 12,
    width: "84%",
  },
});

export default BlockWithSwitchButton;
