import React from "react";
import { Animated, Pressable, StyleSheet, Text } from "react-native";
import { COLOR_1, COLOR_2 } from "../helpers/Variables";

class HomeFooterButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLine: 0,
      fadeAnim: new Animated.Value(0),
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { showLine } = this.state;
    if (prevState.showLine !== showLine) {
      Animated.timing(this.state.fadeAnim, {
        toValue: showLine,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  }

  render() {
    const { onPress, SvgImage, text } = this.props;

    return (
      <Pressable
        style={styles.block}
        onPress={onPress}
        onPressIn={() => this.setState({ showLine: 1 })}
        onPressOut={() => this.setState({ showLine: 0 })}
      >
        <SvgImage style={styles.image} />
        <Text style={styles.text}>{text}</Text>
        <Animated.View
          style={[styles.line, { opacity: this.state.fadeAnim }]}
        />
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  block: {
    width: "30%",
    justifyContent: "flex-end",
    alignItems: "center",
    height: 100,
  },
  image: {
    height: 50,
    width: 50,
    resizeMode: "contain",
  },
  text: {
    marginBottom: 16,
    marginTop: 16,
    fontSize: 10,
    fontFamily: "GothamProMedium",
    color: COLOR_1,
  },
  line: {
    position: "absolute",
    width: "80%",
    height: 3,
    borderRadius: 4,
    backgroundColor: COLOR_2,
    bottom: 8,
    alignSelf: "center",
  },
});

export default HomeFooterButton;
