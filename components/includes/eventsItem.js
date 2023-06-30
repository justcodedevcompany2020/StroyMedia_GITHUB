import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLOR_1, COLOR_9 } from "../helpers/Variables";
import { ImageLike, ImageLikeBlue } from "../helpers/images";
import MyButton from "../includes/MyButton";
import { useDispatch } from "react-redux";
import { likeEventsRequest } from "../../store/reducers/likeEventsPostSlice";
import { checkEventsLikeRequest } from "../../store/reducers/checkEventsLikeSlice";
import { checkChatExistRequest } from "../../store/reducers/checkChatExistSlice";
import { chatOrderRequest } from "../../store/reducers/chatDialogOrderSlice";
import { showMessage } from "react-native-flash-message";

function EventsItem({
  title,
  text,
  personName,
  position,
  photoUri,
  token,
  id,
  navigation,
}) {
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  useEffect(() => {
    dispatch(
      checkEventsLikeRequest({
        token,
        id: id,
      })
    )
      .unwrap()
      .then((result) => {
        setLiked(result?.data?.success);
      });
  }, [token, id, dispatch, navigation]);

  return (
    <View style={styles.section}>
      <View style={styles.sectionContent}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {text}
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
            dispatch(
              checkChatExistRequest({
                token: token,
                id: id,
              })
            )
              .unwrap()
              .then(async (res) => {
                if (res.data.success) {
                  dispatch(
                    chatOrderRequest({
                      token: token,
                      id: res?.data?.data?.chat_id,
                      offset: "10",
                    })
                  )
                    .then((result) => {
                      if (result.payload.success) {
                        navigation.navigate("Chat", {
                          currentPage: "Чаты",
                          title: title,
                          id: res?.data?.data?.chat_id,
                        });
                      }
                    })
                    .catch((err) => {
                      showMessage({
                        message: "повторите попытку",
                        type: "danger",
                      });
                    });
                }
              })
              .catch((err) => {
                showMessage({
                  message: "повторите попытку",
                  type: "danger",
                });
              });
          }}
        >
          Задать вопрос
        </MyButton>

        <TouchableOpacity
          onPress={() => {
            setLiked(!liked);
            dispatch(
              likeEventsRequest({
                token,
                id,
              })
            );
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
