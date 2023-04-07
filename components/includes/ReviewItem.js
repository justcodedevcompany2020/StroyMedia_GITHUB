import React, { Component } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { ImageRatings } from "../helpers/images";
import {
  COLOR_1,
  COLOR_3,
  COLOR_6,
  COLOR_9,
  RATINGS_ACTIVE_IMAGE_WIDTH,
  RATINGS_IMAGE_WIDTH,
} from "../helpers/Variables";

class ReviewItem extends Component {
  countRatingLineWidth = (rating) => {
    if (rating > 5) rating = 5;
    if (rating < 0) rating = 0;
    const [full, add] = [Math.floor(rating), rating % 1];
    return (
      full * (RATINGS_ACTIVE_IMAGE_WIDTH / 5) +
      (add * (RATINGS_ACTIVE_IMAGE_WIDTH / 5) * 76) / 100
    );
  };

  render() {
    const { toOrFrom, review } = this.props;
    return (
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <Image source={{ uri: review.uri }} style={styles.image} />
          <View style={styles.info}>
            <View style={styles.headers}>
              <Text style={styles.name}>{`${toOrFrom}: ${review.name}`}</Text>
              <Text style={styles.date}>{review.date}</Text>
            </View>
            <View style={styles.ratings}>
              <Text style={styles.ratingsText}>оценка:</Text>
              <View style={styles.ratingsBlock}>
                <Image source={ImageRatings} style={styles.ratingsImage} />
                <View
                  style={[
                    styles.lineActive,
                    { width: this.countRatingLineWidth(review.rating) },
                  ]}
                />
                <View style={styles.line} />
              </View>
            </View>
          </View>
        </View>
        <Text style={styles.text}>{review.text}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  info: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 20,
  },
  headers: {},
  name: {
    fontSize: 10,
    fontFamily: "GothamProRegular",
    marginBottom: 5,
    color: COLOR_1,
  },
  date: {
    fontSize: 9,
    fontFamily: "GothamProRegular",
    color: COLOR_9,
  },
  ratings: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingsBlock: {},
  ratingsText: {
    fontSize: 10,
    fontFamily: "GothamProRegular",
    color: COLOR_1,
  },
  text: {
    fontSize: 9,
    fontFamily: "GothamProRegular",
    color: COLOR_9,
    lineHeight: 11,
  },
  line: {
    height: 10,
    backgroundColor: COLOR_6,
    width: "90%",
    position: "absolute",
    zIndex: -2,
    top: 2,
    left: 5,
  },
  lineActive: {
    height: 10,
    backgroundColor: COLOR_3,
    position: "absolute",
    zIndex: -1,
    top: 2,
    left: 13,
  },
  ratingsImage: {
    resizeMode: "contain",
    height: 14,
    width: RATINGS_IMAGE_WIDTH,
  },
});

export default ReviewItem;
