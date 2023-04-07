import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";
import { ImageFavorite, ImageFavoriteGreen } from "../helpers/images";
import { COLOR_1 } from "../helpers/Variables";
import { addFavoriteRequest } from "../../store/reducers/addFavoriteDataSlice";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { membersSingleRequest } from "../../store/reducers/membersSingleSlice";
import { checkLiklyRequest } from "../../store/reducers/checkLikliSlice";

function ParticipantItem({
  imageUri,
  companyName,
  city,
  doingProfile,
  navigation,
  id,
  favorites,
  likedList,
}) {
  const [favorite, setFavorite] = useState(false);
  const [token, setToken] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    AsyncStorage.getItem("token").then((result) => {
      if (result) {
        setToken(result);
      }
    });
  }, []);

  useEffect(() => {
    if (likedList === "is_Favorite") {
      setFavorite(true);
    } else {
      setFavorite(false);
    }
  }, []);

  return (
    <>
      {favorites === "Избранное" ? (
        favorite && (
          <TouchableOpacity
            style={styles.wrapper}
            activeOpacity={0.5}
            onPress={() => {
              dispatch(membersSingleRequest({ token: token, id: id }));
              navigation.navigate("SingleParticipant", {
                currentPage: "Страница участника",
                id,
              });
            }}
          >
            <View style={styles.leftPart}>
              <Image source={{ uri: imageUri }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.name}>{companyName}</Text>
                <Text style={styles.city}>{city}</Text>
                <Text style={styles.prof}>{doingProfile}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                setFavorite(!favorite);
                dispatch(addFavoriteRequest({ token: token, id: id }));
              }}
              styles={styles.favImgBlock}
            >
              {favorite ? <ImageFavoriteGreen /> : <ImageFavorite />}
            </TouchableOpacity>
          </TouchableOpacity>
        )
      ) : (
        <Text>нет данных</Text>
      )}

      {favorites === "Все" && (
        <TouchableOpacity
          style={styles.wrapper}
          activeOpacity={0.5}
          onPress={() => {
            dispatch(membersSingleRequest({ token: token, id: id }));
            navigation.navigate("SingleParticipant", {
              currentPage: "Страница участника",
              id,
            });
          }}
        >
          <View style={styles.leftPart}>
            <Image source={{ uri: imageUri }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{companyName}</Text>
              <Text style={styles.city}>{city}</Text>
              <Text style={styles.prof}>{doingProfile}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              setFavorite(!favorite);
              dispatch(addFavoriteRequest({ token: token, id: id }));
            }}
            styles={styles.favImgBlock}
          >
            {favorite ? <ImageFavoriteGreen /> : <ImageFavorite />}
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 10,
  },
  leftPart: {
    flexDirection: "row",
    justifyContent: "center",
    flex: 1,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 26,
  },
  info: {
    paddingVertical: 10,
    justifyContent: "space-evenly",
  },
  name: {
    fontSize: 12,
    fontFamily: "GothamProRegular",
    color: COLOR_1,
    width: 200,
  },
  city: {
    fontSize: 9,
    fontFamily: "GothamProRegular",
    color: COLOR_1,
    width: 200,
    marginVertical: 10,
  },
  prof: {
    fontSize: 9,
    fontFamily: "GothamProMedium",
    color: COLOR_1,
  },
  favImgBlock: {
    margin: 0,
  },
  favImg: {
    width: 0,
  },
});

export default ParticipantItem;
