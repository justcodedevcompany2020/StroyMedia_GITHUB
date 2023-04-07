import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { COLOR_1, COLOR_9 } from "../helpers/Variables";
import { ImageLike, ImageLikeBlue } from "../helpers/images";
import MyButton from "../includes/MyButton";
import { useDispatch } from "react-redux";
import { likeEventsRequest } from "../../store/reducers/likeEventsPostSlice";
import { checkEventsLikeRequest } from "../../store/reducers/checkEventsLikeSlice";
import { checkChatExistRequest } from "../../store/reducers/checkChatExistSlice";

function EventsItem(props) {
  const { title, text, personName, position, photoUri, token, id, navigation } =
    props;
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    dispatch(checkEventsLikeRequest({ token, id: id }))
      .unwrap()
      .then((result) => {
        setLiked(result?.data?.success);
      });
  }, [token, id, dispatch]);

  return (
    <View style={styles.section}>
      <View style={styles.sectionContent}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionText}>{text}</Text>
        <View style={styles.personBlock}>
          <Text style={styles.personName}>{personName}</Text>
          <Text style={styles.personPosition}>{position}</Text>
          <Image
            source={{ uri: "https://teus.online/" + photoUri }}
            style={styles.personPhoto}
          />
        </View>
      </View>
      <View style={styles.buttonRow}>
        <MyButton
          textStyle={styles.buttonText}
          style={styles.sectionButton}
          onPress={() => {
            dispatch(checkChatExistRequest({ token: token, id: id }))
              .unwrap()
              .then(() => {
                navigation.navigate("Chat", {
                  currentPage: "Чаты",
                  title: title,
                  id: id,
                });
              });
          }}
        >
          Задать вопрос
        </MyButton>
        <TouchableOpacity
          onPress={() => {
            setLiked(!liked);
            dispatch(likeEventsRequest({ token, id }));
          }}
          style={styles.like}
        >
          {liked ? <ImageLikeBlue /> : <ImageLike />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 36,
  },
  sectionContent: {
    paddingLeft: 58,
  },
  sectionTitle: {
    fontFamily: "GothamProRegular",
    fontSize: 12,
    color: COLOR_1,
    marginBottom: 10,
    marginTop: 20,
  },
  sectionText: {
    fontFamily: "GothamProRegular",
    fontSize: 9,
    color: COLOR_9,
    marginBottom: 15,
    lineHeight: 11,
    textAlign: "left",
  },
  personBlock: {
    marginBottom: 34,
  },
  personName: {
    fontFamily: "GothamProRegular",
    fontSize: 10,
    color: COLOR_1,
  },
  personPosition: {
    fontFamily: "GothamProRegular",
    fontSize: 10,
    color: COLOR_9,
  },
  personPhoto: {
    width: 44,
    height: 44,
    borderRadius: 30,
    position: "absolute",
    left: -60,
    top: -8,
  },
  buttonRow: {},
  sectionButton: {
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  buttonText: {
    fontSize: 12,
  },
  like: {
    position: "absolute",
    right: 40,
    top: 6,
  },
  arrowStyle: {
    top: 14,
  },
  nextArrow: {
    position: "absolute",
    right: 0,
    bottom: 44,
  },
});

export default EventsItem;
