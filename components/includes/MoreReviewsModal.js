import React from "react";
import Modal from "react-native-modal";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { COLOR_1, COLOR_5 } from "../helpers/Variables";
import ReviewItem from "./ReviewItem";
import moment from "moment";

function MoreReviewsModal(props) {
  const { onCancel, isVisible, toOrFrom, data } = props;

  const renderItem = ({ item }) => {
    const date = item.date.$date.$numberLomg;
    return (
      <ReviewItem
        toOrFrom={"на"}
        review={{
          uri: "https://teus.online" + item.user.avatar,
          name: item.user.name,
          date: moment(date).format("DD.MM.YYYY"),
          id: 3,
          text: item.review,
          rating: item.user.rate_plus,
        }}
      />
    );
  };

  return (
    <Modal
      style={styles.modal}
      isVisible={isVisible}
      transparent={true}
      animationIn={"fadeInUp"}
      animationOut={"fadeOutDown"}
      onRequestClose={onCancel}
      hardwareAccelerated={true}
      onBackdropPress={onCancel}
      backdropOpacity={0.3}
      animationInTiming={100}
      animationOutTiming={100}
    >
      <View style={styles.wrapper}>
        <Text style={styles.title}>
          Отзывы {toOrFrom === "from" && "на "}участника
        </Text>
        <FlatList data={data} renderItem={renderItem} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    alignItems: "center",
    justifyContent: "center",
  },
  wrapper: {
    backgroundColor: COLOR_5,
    width: "98%",
    height: "80%",
    position: "absolute",
    paddingHorizontal: 18,
    paddingVertical: 25,
    borderRadius: 10,
  },
  title: {
    color: COLOR_1,
    fontFamily: "GothamProMedium",
    fontSize: 12,
    lineHeight: 14,
  },
  button: {
    color: COLOR_1,
    fontFamily: "GothamProRegular",
    fontSize: 12,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
  },
});

export default MoreReviewsModal;
