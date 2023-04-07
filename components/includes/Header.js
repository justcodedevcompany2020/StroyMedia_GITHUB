import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import {
  COLOR_1,
  COLOR_5,
  WRAPPER_PADDINGS,
  COLOR_2,
} from "../helpers/Variables";
import {
  ImageBackArrow,
  ImageHomeIcon,
  ImageNotificationsIcon,
  ImageSave,
} from "../helpers/images";
import { getAllnotificationsRequest } from "../../store/reducers/getAllNotificationsSlice";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Header(props) {
  const { currentPage, home, navigation, onSavePress } = props;
  const data = useSelector((state) =>
    state.getAllNotificationsSlice?.data.date_16_08_2022
      ? state.getAllNotificationsSlice?.data.date_16_08_2022[0]
      : null
  );
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    AsyncStorage.getItem("token").then((result) => {
      if (result) {
        dispatch(getAllnotificationsRequest({ token: result }));
      }
    });
  }, [dispatch]);

  const isVisible = () => {
    setVisible(true);
  };
  const onCancel = () => {
    setVisible(false);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.leftPart}>
        {currentPage && (
          <>
            <TouchableOpacity
              onPress={navigation.goBack}
              style={styles.imageView}
            >
              <ImageBackArrow style={styles.image} />
            </TouchableOpacity>
            <Text style={styles.currentPage}>{currentPage}</Text>
          </>
        )}
      </View>
      <View style={styles.rightPart}>
        {home ? (
          <>
            <TouchableOpacity
              onPress={() => navigation.navigate("Home")}
              style={styles.homeImageView}
            >
              <ImageHomeIcon style={styles.homeImage} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={isVisible}
              style={styles.notificationImageView}
            >
              <ImageNotificationsIcon style={styles.notificationImage} />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.saveIconView} onPress={onSavePress}>
            <ImageSave style={styles.saveIcon} />
          </TouchableOpacity>
        )}
      </View>
      <Modal
        style={styles.modal}
        isVisible={visible}
        transparent={true}
        animationIn={"fadeInUp"}
        animationOut={"fadeOutDown"}
        // onRequestClose={onCancel}
        hardwareAccelerated={true}
        onBackdropPress={onCancel}
        backdropOpacity={0.3}
        animationInTiming={100}
        animationOutTiming={100}
      >
        <View style={styles.modalWrapper}>
          <Text style={styles.title}>Уведомления</Text>
          <View>
            {/* {data ? 
                            <View>
                                <Image source={{ uri: 'https://teus.online/' + data?.author.avatar }} style={styles.imageStyles} />
                                <View><Text style={styles.notifyText}>{data?.type}</Text>
                                    <Text style={styles.notifyText}>{data?.author?.name}</Text> </View>
                            </View>
                            :null
                      
                        } */}
            {data && (
              <View style={styles.notificationWrapper}>
                <Image
                  source={{ uri: "https://teus.online/" + data?.author.avatar }}
                  style={styles.imageStyles}
                />
                <View>
                  <Text style={styles.authorNotification}>
                    {data?.author.name}
                  </Text>
                  <Text style={styles.notifyText}>{data?.type}</Text>
                </View>
              </View>
            )}
            {!data && (
              <Text style={styles.noDataText}>У Вас нет уведомлений</Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    paddingTop: 60,
    width: "100%",
    paddingHorizontal: WRAPPER_PADDINGS,
    backgroundColor: COLOR_5,
    zIndex: 2,
    paddingBottom: 14,
  },
  authorNotification: {
    color: COLOR_2,
    fontFamily: "GothamProRegular",
    fontSize: 15,
    alignItems: "center",
    alignSelf: "center",
  },
  notificationWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  imageStyles: {
    width: 50,
    height: 50,
    resizeMode: "cover",
  },
  modalWrapper: {
    backgroundColor: COLOR_5,
    width: "94%",
    height: "60%",
    position: "absolute",
    paddingHorizontal: 30,
    paddingVertical: 25,
    borderRadius: 10,
  },
  modal: {
    alignItems: "center",
    justifyContent: "center",
  },
  imageView: {
    marginRight: 20,
  },
  image: {
    width: 22,
    height: 20,
  },
  currentPage: {
    fontFamily: "GothamProRegular",
    fontSize: 14,
    color: COLOR_1,
  },
  leftPart: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightPart: {
    flexDirection: "row",
    alignItems: "center",
  },
  homeImageView: {
    marginRight: 20,
  },
  homeImage: {
    width: 22,
    height: 22,
  },
  notificationImageView: {},
  notificationImage: {
    width: 19,
    height: 22,
  },
  saveIconView: {},
  saveIcon: {},
  title: {
    textAlign: "center",
    fontFamily: "GothamProRegular",
    fontSize: 18,
    color: COLOR_1,
  },
  notifyText: {
    color: COLOR_1,
    fontFamily: "GothamProRegular",
    fontSize: 12,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 5,
  },
  noDataText: {
    textAlign: "center",
    marginTop: 50,
    fontFamily: "GothamProRegular",
    color: COLOR_1,
    fontSize: 20,
  },
});

export default Header;
