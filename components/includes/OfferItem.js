import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Pressable,
} from "react-native";
import {
  ImageFavorite,
  ImageFavoriteGreen,
  ImageOffersArrow,
  ImageRatingSmall,
} from "../helpers/images";
import { useDispatch } from "react-redux";
import {
  COLOR_2,
  COLOR_5,
  COLOR_6,
  COLOR_8,
  COLOR_9,
  WRAPPER_PADDINGS,
} from "../helpers/Variables";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLiklyCatRequest } from "../../store/reducers/liklyCatSlice";
import { checkLiklyOfferRequest } from "../../store/reducers/checkOfferLiklySlice";
import moment from "moment";

export function OfferItem(props) {
  const { item, id, timeStamnp, date, navigation, tab, typeId, likedList } =
    props;
  const [token, setToken] = useState("");
  const [liked, setLiked] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    AsyncStorage.getItem("token").then((result) => {
      if (result) {
        setToken(result);
      }
    });
  }, [token]);

  useEffect(() => {
    if (likedList === "is_Favorite") {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [likedList]);

  return (
    <>
      {tab === "Избранное" && liked && (
        <Pressable
          style={styles.item}
          onPress={() =>
            navigation.navigate("SendOffer", {
              currentPage: "Отправить предложение",
              item: item,
              id: typeId,
            })
          }
        >
          <View style={styles.row}>
            <View style={styles.locationInfo}>
              <Text style={styles.fromCity}>
                {item?.from_city?.title?.ru?.replace("(RU)", "")}
              </Text>
              <ImageOffersArrow />
              <Text style={styles.toCity}>
                {item?.to_city?.title?.ru?.replace("(RU)", "")}
              </Text>
            </View>
            <Text style={(item.price || item.price === 0) && styles.price}>
              {item.price > 0 ? item.price + " p" : item.price}
            </Text>
          </View>
          <View style={styles.row}>
            <View>
              <Text style={styles.type}>
                {moment(timeStamnp).format("DD MMMM")}
              </Text>
              <Text style={styles.type}>{item.type_container?.title}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setLiked(!liked);
                dispatch(getLiklyCatRequest({ token, id: item.last_id }));
              }}
            >
              {liked ? <ImageFavoriteGreen /> : <ImageFavorite />}
            </TouchableOpacity>
            <Text style={styles.date}>
              {moment(+date).format("YYYY-MM-DD")}
            </Text>
          </View>
          <View style={styles.row}>
            <View style={styles.ratingBlock}>
              <ImageRatingSmall />
              <Text style={styles.rating}>
                {item?.user?.rate_plus
                  ? 5
                  : item?.user?.rate_good
                  ? 4
                  : item?.user?.rate_netral
                  ? 3
                  : item?.user?.rate_minus
                  ? 2
                  : 1}
              </Text>
              <Text style={styles.companyName}>{item.createdBy}</Text>
            </View>
            <Text style={styles.dateAdded}>{item.dateAdded}</Text>
          </View>
        </Pressable>
      )}
      {tab === "Все предложения" && (
        <Pressable
          style={styles.item}
          onPress={() =>
            navigation.navigate("SendOffer", {
              currentPage: "Отправить предложение",
              item: item,
              id: typeId,
            })
          }
        >
          <View style={styles.row}>
            <View style={styles.locationInfo}>
              <Text style={styles.fromCity}>
                {item?.from_city?.title?.ru?.replace("(RU)", "")}
              </Text>
              <ImageOffersArrow />
              <Text style={styles.toCity}>
                {item?.to_city?.title?.ru?.replace("(RU)", "")}
              </Text>
            </View>
            <Text style={(item.price || item.price === 0) && styles.price}>
              {item.price > 0 ? item.price + " p" : item.price}
            </Text>
          </View>
          <View style={styles.row}>
            <View>
              <Text style={styles.type}>
                {moment(timeStamnp).format("DD MMMM")}
              </Text>
              <Text style={styles.type}>{item.type_container?.title}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setLiked(!liked);
                dispatch(getLiklyCatRequest({ token, id: item.last_id }));
              }}
            >
              {liked ? <ImageFavoriteGreen /> : <ImageFavorite />}
            </TouchableOpacity>
            <Text style={styles.date}>
              {moment(+date).format("YYYY-MM-DD")}
            </Text>
          </View>
          <View style={styles.row}>
            <View style={styles.ratingBlock}>
              <ImageRatingSmall />
              <Text style={styles.rating}>
                {item?.user?.rate_plus
                  ? 5
                  : item?.user?.rate_good
                  ? 4
                  : item?.user?.rate_netral
                  ? 3
                  : item?.user?.rate_minus
                  ? 2
                  : 1}
              </Text>
              <Text style={styles.companyName}>{item.createdBy}</Text>
            </View>
            <Text style={styles.dateAdded}>{item.dateAdded}</Text>
          </View>
        </Pressable>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: COLOR_5,
    paddingVertical: 20,
    borderBottomColor: COLOR_6,
    borderBottomWidth: 1,
    paddingHorizontal: WRAPPER_PADDINGS,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  fromCity: {
    marginRight: 10,
    color: COLOR_8,
    fontSize: 12,
    fontFamily: "GothamProMedium",
  },
  toCity: {
    marginLeft: 10,
    color: COLOR_8,
    fontSize: 12,
    fontFamily: "GothamProMedium",
  },
  price: {
    color: COLOR_5,
    fontSize: 12,
    fontFamily: "GothamProMedium",
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: COLOR_2,
    borderRadius: 10,
  },
  type: {
    color: COLOR_8,
    fontSize: 10,
    fontFamily: "GothamProRegular",
    marginBottom: 6,
  },
  ratingBlock: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    color: COLOR_9,
    fontSize: 10,
    fontFamily: "GothamProRegular",
    marginLeft: 5,
    marginRight: 15,
  },
  companyName: {
    color: COLOR_9,
    fontSize: 10,
    fontFamily: "GothamProRegular",
  },
  dateAdded: {
    color: COLOR_9,
    fontSize: 10,
    fontFamily: "GothamProRegular",
  },
  hiddenWrapper: {
    paddingVertical: 16,
    position: "absolute",
    right: 0,
    top: 0,
    paddingRight: WRAPPER_PADDINGS,
    height: "100%",
  },
  hiddenItem: {
    alignSelf: "flex-end",
    justifyContent: "center",
    borderLeftColor: COLOR_6,
    borderLeftWidth: 1,
    height: "100%",
    paddingLeft: 8,
  },
  hiddenBlock: {
    alignItems: "center",
  },
  hiddenItemTextBlock: {
    alignItems: "center",
    marginTop: 10,
  },
  hiddenItemText: {
    color: "#000",
    fontSize: 9,
    fontFamily: "GothamProRegular",
  },
  header: {
    backgroundColor: COLOR_5,
  },
  fadeBlock: {
    height: "100%",
    width: WRAPPER_PADDINGS,
    position: "absolute",
    zIndex: 2,
    top: 200,
    left: 0,
  },
  fade: {
    width: "100%",
    height: "100%",
  },
  date: {
    position: "absolute",
    bottom: -40,
    right: 0,
    fontFamily: "GothamProRegular",
  },
});
