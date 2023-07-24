import React, {useEffect, useState} from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {ImageFavorite, ImageFavoriteGreen} from "../helpers/images";
import {COLOR_1} from "../helpers/Variables";
import {addFavoriteRequest} from "../../store/reducers/addFavoriteDataSlice";
import {useDispatch} from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {membersSingleRequest} from "../../store/reducers/membersSingleSlice";

function ParticipantItem({
  imageUri,
  companyName,
  city,
  doingProfile,
  navigation,
  id,
  favorites,
  likedList,
  index,
}) {
  const [token, setToken] = useState();
  const [liked, setLiked] = useState(likedList);
  const dispatch = useDispatch();

  useEffect(() => {
    AsyncStorage.getItem("token").then((result) => {
      if (result) {
        setToken(result);
      }
    });
  }, []);

  useEffect(() => {
    setLiked(likedList);
  }, [likedList]);


  return (
    <>
      {favorites === "Избранное" && liked[index] == "is_Favorite" ? (
        <TouchableOpacity
          style={styles.wrapper}
          activeOpacity={0.5}
          onPress={() => {
            dispatch(membersSingleRequest({token: token, id: id}));
            navigation.navigate("SingleParticipant", {
              currentPage: "Страница участника",
              id,
            });
          }}
        >
          <View style={styles.leftPart}>
            <Image source={{uri: imageUri}} style={styles.image}/>
            <View style={styles.info}>
              <Text style={styles.name}>{companyName}</Text>
              <Text style={styles.city}>{city}</Text>
              <Text style={styles.prof}>{doingProfile}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              dispatch(addFavoriteRequest({token: token, id: id}));

              setLiked((prevState) => {
                return prevState.map((like) => {
                  if (like === "is_Favorite") {
                    return "not_Favorite";
                  } else {
                    return "is_Favorite";
                  }
                });
              });

            }}
            styles={styles.favImgBlock}
          >
            {liked[index] == "is_Favorite" ? (
              <ImageFavoriteGreen/>
            ) : (
               <ImageFavorite/>
             )}
          </TouchableOpacity>
        </TouchableOpacity>
      ) : null}

      {favorites === "Все" && (
        <TouchableOpacity
          style={styles.wrapper}
          activeOpacity={0.5}
          onPress={() => {
            dispatch(membersSingleRequest({token: token, id: id}));
            navigation.navigate("SingleParticipant", {
              currentPage: "Страница участника",
              id,
            });
          }}
        >
          <View style={styles.leftPart}>
            <Image source={{uri: imageUri}} style={styles.image}/>
            <View style={styles.info}>
              <Text style={styles.name}>{companyName}</Text>
              <Text style={styles.city}>{city}</Text>
              <Text style={styles.prof}>{doingProfile}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              dispatch(addFavoriteRequest({token: token, id: id}));

              setLiked((prevState) => {
                return prevState.map((like) => {
                  if (like === "is_Favorite") {
                    return "not_Favorite";
                  } else {
                    return "is_Favorite";
                  }
                });
              });
            }}
            styles={styles.favImgBlock}
          >
            {liked[index] == "is_Favorite" ? (
              <ImageFavoriteGreen/>
            ) : (
               <ImageFavorite/>
             )}
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
