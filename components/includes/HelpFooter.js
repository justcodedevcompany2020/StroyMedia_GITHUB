import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
import { ImageEmail, ImagePhone } from "../helpers/images";
import { COLOR_1, COLOR_10, WRAPPER_PADDINGS } from "../helpers/Variables";

class HelpFooter extends Component {
  render() {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.title}>Задать вопрос в Техническую службу</Text>
        <Text style={styles.description}>
          Если не нашли ответ на ваш вопрос, свяжитесь с нашей технической
          службой:
        </Text>
        <View style={styles.contactRow}>
          <View style={styles.contactBlock}>
            <ImageEmail style={styles.contactImg} />
            <Text style={styles.contactDesc}>support@teus.online</Text>
          </View>
          <View style={styles.contactBlock}>
            <ImagePhone style={styles.contactImg} />
            <Text style={styles.contactDesc}>8-904-895-77-75</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLOR_10,
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: WRAPPER_PADDINGS,
  },
  title: {
    fontSize: 12,
    fontFamily: "GothamProMedium",
    marginBottom: 20,
    color: COLOR_1,
  },
  description: {
    fontSize: 10,
    fontFamily: "GothamProLight",
    marginBottom: 20,
    color: COLOR_1,
    width: "70%",
    lineHeight: 12,
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  contactBlock: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "center",
  },
  contactImg: {
    marginRight: 10,
  },
  contactDesc: {
    fontSize: 12,
    fontFamily: "GothamProBold",
    color: COLOR_1,
  },
});

export default HelpFooter;
