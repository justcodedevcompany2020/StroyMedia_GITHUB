import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import {
  COLOR_1,
  COLOR_11,
  COLOR_2,
  WRAPPER_PADDINGS,
} from "../helpers/Variables";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.ScrollView = React.createRef();
  }

  convertTabs = (tabs, activeTab) => {
    tabs = tabs.slice(1).filter((tab) => tab !== activeTab);
    tabs.unshift(activeTab);
    return tabs;
  };

  scrollToStart() {
    this.ScrollView.scrollTo({ x: 0 });
  }

  render() {
    let { tabs, activeTab, onPress, secondary } = this.props;

    return (
      <View style={styles.container}>
        <ScrollView
          style={secondary && styles.secondaryWrapper}
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={(ref) => (this.ScrollView = ref)}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              activeOpacity={0.3}
              style={styles.block}
              onPress={() => {
                onPress(tab);
                //if (secondary) this.scrollToStart();
              }}
              key={tab}
            >
              <Text
                style={[
                  styles.text,
                  secondary &&
                    (activeTab !== tab
                      ? styles.secondaryText
                      : styles.secondaryActiveText),
                ]}
              >
                {tab}
              </Text>
              {activeTab === tab && <View style={styles.line} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    height: 30,
    paddingHorizontal: WRAPPER_PADDINGS,
  },
  secondaryWrapper: {
    backgroundColor: COLOR_11,
    paddingTop: 20,
    paddingBottom: 14,
    position: "absolute",
    width: Dimensions.get("window").width,
    zIndex: 1,
    bottom: 0,
    paddingHorizontal: WRAPPER_PADDINGS,
  },
  block: {
    marginRight: 30,
  },
  text: {
    fontFamily: "GothamProMedium",
    fontSize: 12,
    color: COLOR_1,
    marginBottom: 7,
  },
  line: {
    width: "100%",
    height: 3,
    borderRadius: 4,
    backgroundColor: COLOR_2,
  },
  secondaryText: {
    fontFamily: "GothamProRegular",
    fontSize: 10,
    color: COLOR_1,
  },
  secondaryActiveText: {
    fontSize: 10,
  },
});

export default NavBar;
