import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Wrapper from "../helpers/Wrapper";
import HomeMainButtons from "../includes/HomeMainButtons";
import HomeFooterButtons from "../includes/HomeFooterButtons";
import { ImageLogo } from "../helpers/images";
import { WRAPPER_PADDINGS } from "../helpers/Variables";

class Home extends React.Component {
  render() {
    const { navigation } = this.props;
    return (
      <Wrapper
        withImage
        header={{
          home: true,
          navigation,
        }}
      >
        <View style={styles.wrapper}>
          <View style={styles.block}>
            <View style={styles.logoView}>
              <ImageLogo style={styles.logo} />
            </View>
          </View>
          <HomeMainButtons navigation={navigation} />
          <HomeFooterButtons navigation={navigation} />
        </View>
      </Wrapper>
    );
  }
}

const styles = StyleSheet.create({
  block: {
    marginTop: (Dimensions.get("window").height * 20) / 100,
  },
  logoView: {
    width: "100%",
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 32,
  },
  wrapper: {
    paddingHorizontal: WRAPPER_PADDINGS,
  },
});

export default Home;
