import React, { useEffect, useRef, useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Platform,
  ActivityIndicator,
  TextInput,
} from "react-native";
import Wrapper from "../helpers/Wrapper";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "../includes/NavBar";
import MyInput from "../includes/MyInput";
import {
  COLOR_1,
  COLOR_10,
  COLOR_8,
  WRAPPER_PADDINGS,
} from "../helpers/Variables";
import DatePicker from "../includes/DatePicker";
import AccordionItem from "../includes/AccordionItem";
import MyButton from "../includes/MyButton";
import BlockWithSwitchButton from "../includes/BlockWithSwitchButton";
import SelectDropdown from "react-native-select-dropdown";
import { getCitys } from "../../store/reducers/getCitysSlice";
import { sendCatRequest } from "../../store/reducers/sendCatSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authRequest } from "../../store/reducers/authUserSlice";
import * as ImagePicker from "expo-image-picker";
import { Entypo } from "@expo/vector-icons";
import { showMessage } from "react-native-flash-message";
import Modal from "react-native-modal";
import { AntDesign } from "@expo/vector-icons";
import _ from "lodash";
import DelayInput from "react-native-debounce-input";

const container = ["40 ST", "20 (30)", "20 (24)", "40 HQ"];
const valuta = ["₽", "€", "$"];
const conditations = ["Б/у", "Новый"];
const typespay = ["Любой вариант", "безналичный расчет", "наличный расчет"];
const reestrized = ["Любой исключен", "включен"];

function CreatingApplication(props) {
  const [secondaryTabs, setSecondaryTabs] = useState([
    "Продажа КТК",
    "Поиск КТК",
    "Выдача КТК",
    "Поездной сервис",
    "Заявка на ТЭО",
  ]);
  const [activeSecondaryTab, setActiveSecondaryTab] = useState("Продажа КТК");
  const [whereFrom, setWhereFrom] = useState("");
  const [whereTo, setWhereTo] = useState("");
  const [containerCount, setContainerCount] = useState("");
  const [date, setDate] = useState(new Date());
  const [comment, setComment] = useState("");
  const [price, setPrice] = useState("");
  const [token, setToken] = useState("");
  const [showDatePicker, setShowDatePicker] = useState("");
  const [currency, setCurrency] = useState("");
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [whereToCount, setWhereToCount] = useState(1);
  const [termOfUse, setTermOfUse] = useState(null);
  const [from_city, setFrom_city] = useState();
  const [to_city, setTo_city] = useState();
  const [weight, setWeight] = useState("");
  const [citys, setCitys] = useState([]);
  const dispatch = useDispatch();
  const { route, navigation } = props;
  const { currentPage, user } = route.params;
  const [openCitys, setOpenCitys] = useState(false);
  const [openCitysFrom, setOpenCitysFrom] = useState(false);
  const [typeContainer, setTypeContiner] = useState();
  const [fromCityName, setFromCityName] = useState();
  const [toCityName, setToCityName] = useState();
  const [conditation, setConditation] = useState();
  const [typePay, setTypePay] = useState();
  const [restrict, setRestrict] = useState();
  const [selectedImage, setSelectedImage] = useState("");
  const [fileName, setFileName] = useState();
  const [searchValue, setSearchValue] = useState("");
  const [hash, setHash] = useState(null);
  const [loading, setLoading] = useState(false);
  let allCitys = useSelector(
    (state) => state.getCitysSlice?.data?.data?.data?.citys
  );
  const DropDownRef = useRef({});
  const DrowDownTypeContainerRef = useRef({});
  //   const getFileSize = async (fileUri) => {
  //     let fileInfo = await FileSystem.getInfoAsync(fileUri);
  //     return fileInfo.size;
  //   };
  // const deleteSelectImage = (selectImage) => {
  //   /* @ts-ignore */
  //   const filteredList = selectedImage?.filter((item) => item !== selectImage);
  //   setSelectedImage(filteredList);
  // };

  function getImageFormat(str) {
    const afterDot = str.substr(str.indexOf(".") + 1);
    return afterDot;
  }

  const openCitysModal = () => {
    setOpenCitys(!openCitys);
  };

  const openCytysFromModal = () => {
    setOpenCitysFrom(!openCitysFrom);
  };
  const compareData = {
    from_city,
    to_city,
    typeContainer: typeContainer + "",
    containerCount: containerCount + "",
    date,
    price: price + "",
    currency: currency + "",
  };
  const compareDataSales = {
    ...compareData,
    typePay: typePay,
    conditation: conditation,
    comment,
    selectedImage,
    restrict,
    to_city: "10",
  };

  const save = () => {
    _.every(Object.values(compareData)) && setLoading(true);
    _.every(Object.values(compareDataSales)) && setLoading(true);
    const data = new FormData();
    data.append("img", {
      uri:
        Platform.OS === "android"
          ? selectedImage
          : selectedImage.replace("file://", ""),
      name: fileName,
      type: `image/${getImageFormat(selectedImage)}`,
    });
    data.append("secret_token", token);
    data.append("last_id", 5);
    data.append("count", containerCount + "");
    data.append("price", price + "");
    data.append("dislokaciya", from_city + "");
    data.append(
      "condition",
      conditation === "Б/у" ? 3 : conditation === "Новый" ? 2 : ""
    );
    data.append("description", comment);
    data.append(
      "typepay",
      typePay === "Любой вариант"
        ? "4"
        : typePay === "безналичный расчет"
        ? "3"
        : typePay === "наличный расчет"
        ? "2"
        : ""
    );
    data.append(
      "reestrrzhd",
      restrict === "Любой исключен" ? "3" : restrict === "включен" ? "2" : ""
    );
    data.append(
      "type_container",
      typeContainer === 0 || typeContainer === 1 ? "4" : typeContainer + ""
    );
    data.append("currency", currency === 0 ? "3" : currency + "");
    data.append("responsible", user?.last_id + "");
    data.append("_type_op", saveAsDraft ? "draft" : "onwork");

    activeSecondaryTab === "Продажа КТК" &&
      _.every(Object.values(compareDataSales)) &&
      dispatch(sendCatRequest(data))
        .unwrap()
        .then(() => navigation.pop(2))
        .catch((e) => {
          showMessage({
            message: "Все поля должны быть заполнены",
            type: "danger",
          });
        });
    activeSecondaryTab === "Продажа КТК" &&
      !_.every(Object.values(compareDataSales)) &&
      showMessage({
        message: "Все поля должны быть заполнены",
        type: "danger",
      });
    activeSecondaryTab !== "Продажа КТК" &&
      !_.every(Object.values(compareData)) &&
      showMessage({
        message: "Все поля должны быть заполнены",
        type: "danger",
      });

    activeSecondaryTab !== "Продажа КТК" &&
      _.every(Object.values(compareData)) &&
      dispatch(
        sendCatRequest({
          secret_token: token,
          last_id:
            activeSecondaryTab === "Выдача КТК" ||
            activeSecondaryTab === "Поездной сервис"
              ? "3"
              : activeSecondaryTab === "Поиск КТК"
              ? "2"
              : activeSecondaryTab === "Заявка на ТЭО"
              ? "7"
              : "",
          from_city: from_city + "",
          to_city: to_city + "",
          count: containerCount + "",
          date_shipment: date + "",
          period: date + "",
          price: price + "",
          type_container:
            typeContainer === 0 || typeContainer === 1
              ? "4"
              : typeContainer + "",
          currency: currency === 0 ? "3" : currency + " ",
          responsible: user?.last_id + "",
          _type_op: saveAsDraft ? "draft" : "onwork",
        })
      )
        .unwrap()
        .then((e) => {
          setLoading(false);
          props.navigation.pop(2);
        })
        .catch((e) => {
          setLoading(false);
          showMessage({
            message: "Все поля должны быть заполнены",
            type: "danger",
          });
        });
  };

  useEffect(() => {
    const getCytys = () => {
      dispatch(getCitys())
        .unwrap()
        .then((result) => {
          setCitys(result.data.data.citys);
        });
    };
    getCytys();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0,
    });
    if (!result.canceled) {
      setFileName(result.assets[0].uri.split("/").pop());
      setSelectedImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    (async () => {
      const status = ImagePicker.requestMediaLibraryPermissionsAsync();
      setHash(status === "granted");
    })();
  }, []);

  const resetData = () => {
    setWhereFrom("");
    setWhereTo("");
    setContainerCount("");
    setComment("");
    setPrice("");
    setShowDatePicker("");
    setCurrency("");
    setSaveAsDraft(false);
    setWhereToCount(1);
    setTermOfUse(null);
    setWeight("");
    setFrom_city("");
    setTo_city("");
    setFromCityName("");
    setToCityName("");
    setTypeContiner("");
    DropDownRef?.current?.reset();
    DrowDownTypeContainerRef?.current?.reset();
    setOpenCitys(false);
    setOpenCitysFrom(false);
    setSearchValue("");
  };

  useEffect(() => {
    AsyncStorage.getItem("token").then((result) => {
      setToken(result);
      dispatch(authRequest({ token: result }));
    });
  }, []);

  useEffect(() => {
    searchValue && filtered(searchValue);
  }, [searchValue]);

  const searchKTK = () => {
    return (
      <>
        <AccordionItem
          titleComponent={
            <Text style={styles.selectText}>
              {fromCityName ? fromCityName : "Откуда"}
            </Text>
          }
          wrapperStyle={openCitys ? styles.openModal : styles.select}
          headerStyle={styles.selectHeader}
          arrowStyle={styles.selectArrowStyle}
          isopenModal={openCitysModal}
        >
          <View style={styles.citysSearch}>
            <DelayInput
              placeholder="Search"
              value={searchValue}
              minLength={1}
              onChangeText={(text) => setSearchValue(text)}
              delayTimeout={500}
              style={styles.searchInput}
            />
          </View>
          <FlatList
            data={citys}
            keyExtractor={(item) => item.last_id}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setFromCityName(item?.title?.ru || item.title);
                    setFrom_city(item.last_id);
                  }}
                >
                  <Text style={{ marginBottom: 8 }}>
                    {item.title.ru || item.title}
                  </Text>
                </TouchableOpacity>
              );
            }}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={20}
          />
        </AccordionItem>
        <AccordionItem
          titleComponent={
            <Text style={styles.selectText}>
              {toCityName ? toCityName : "Куда"}
            </Text>
          }
          wrapperStyle={openCitysFrom ? styles.openModal : styles.select}
          headerStyle={styles.selectHeader}
          arrowStyle={styles.selectArrowStyle}
          isopenModal={openCytysFromModal}
        >
          <View style={styles.citysSearch}>
            <DelayInput
              placeholder="Search"
              value={searchValue}
              minLength={1}
              onChangeText={(text) => setSearchValue(text)}
              delayTimeout={500}
              style={styles.searchInput}
            />
          </View>
          <FlatList
            data={citys}
            keyExtractor={(item) => item.last_id}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setToCityName(item?.title?.ru || item.title);
                    setTo_city(item.last_id);
                  }}
                >
                  <Text style={{ marginBottom: 8 }}>
                    {item.title.ru || item.title}
                  </Text>
                </TouchableOpacity>
              );
            }}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={20}
          />
        </AccordionItem>
        <View style={styles.containerStyle}>
          <SelectDropdown
            searchInputStyle={{
              borderColor: "black",
              borderWidth: 0.2,
              marginVertical: 10,
              height: 40,
            }}
            ref={DrowDownTypeContainerRef}
            dropdownIconPosition="right"
            renderDropdownIcon={() => {
              return (
                <Entypo name="chevron-small-down" size={32} color={COLOR_1} />
              );
            }}
            defaultButtonText="Выберите тип контейнера"
            buttonTextStyle={{
              color: COLOR_1,
              fontSize: 14,
              textAlign: "left",
            }}
            buttonStyle={{ height: 40, width: "100%", borderRadius: 8 }}
            search
            data={container}
            onSelect={(selectedItem, index) => {
              setTypeContiner(index);
            }}
            rowStyle={{
              flex: 1,
              justifyContent: "space-between",
              backgroundColor: "white",
              borderBottomColor: "white",
            }}
            rowTextStyle={{
              textAlign: "left",
              fontSize: 16,
            }}
          />
        </View>
        <MyInput
          label={"Количество контейнеров"}
          value={containerCount}
          onChangeText={(val) => setContainerCount(val)}
          keyboardType={"numeric"}
        />
        <DatePicker
          date={date}
          setDate={(event, date) => {
            setShowDatePicker(false);
            return setDate(date);
          }}
        />
        <MyInput
          label={"Ставка"}
          value={price}
          onChangeText={(val) => setPrice(val)}
          keyboardType={"numeric"}
        />
        <View style={styles.containerStyle}>
          <SelectDropdown
            ref={DropDownRef}
            defaultButtonText="Валюта"
            dropdownIconPosition="right"
            renderDropdownIcon={() => {
              return (
                <Entypo name="chevron-small-down" size={32} color={COLOR_1} />
              );
            }}
            buttonTextStyle={{
              color: COLOR_1,
              fontSize: 14,
              textAlign: "left",
            }}
            buttonStyle={{ height: 40, width: "100%", borderRadius: 8 }}
            data={valuta}
            onSelect={(selectedItem, index) => {
              setCurrency(index);
            }}
            rowStyle={{
              flex: 1,
              justifyContent: "space-between",
              backgroundColor: "white",
              borderBottomColor: "white",
            }}
            rowTextStyle={{
              textAlign: "left",
              fontSize: 16,
            }}
          />
        </View>
      </>
    );
  };

  const sellKTK = () => {
    return (
      <>
        <View style={styles.containerStyle}>
          <SelectDropdown
            searchInputStyle={{
              marginVertical: 10,
              height: 40,
            }}
            ref={DrowDownTypeContainerRef}
            defaultButtonText="Выберите тип контейнера"
            dropdownIconPosition="right"
            renderDropdownIcon={() => {
              return (
                <Entypo name="chevron-small-down" size={32} color={COLOR_1} />
              );
            }}
            buttonTextStyle={{
              color: COLOR_1,
              fontSize: 14,
              textAlign: "left",
            }}
            buttonStyle={{ height: 40, width: "100%", borderRadius: 8 }}
            search
            data={container}
            onSelect={(selectedItem, index) => {
              setTypeContiner(index);
            }}
            rowStyle={{
              flex: 1,
              justifyContent: "space-between",
              backgroundColor: "white",
              borderBottomColor: "white",
            }}
            rowTextStyle={{
              textAlign: "left",
              fontSize: 16,
            }}
          />
        </View>
        <MyInput
          label={"Количество контейнеров"}
          value={containerCount}
          onChangeText={(val) => setContainerCount(val)}
          keyboardType={"numeric"}
        />
        <MyInput
          label={"Цена"}
          value={price}
          onChangeText={(val) => setPrice(val)}
          keyboardType={"numeric"}
        />
        <View style={styles.containerStyle}>
          <SelectDropdown
            ref={DropDownRef}
            dropdownIconPosition="right"
            renderDropdownIcon={() => {
              return (
                <Entypo name="chevron-small-down" size={32} color={COLOR_1} />
              );
            }}
            defaultButtonText="Валюта"
            buttonTextStyle={{
              color: COLOR_1,
              fontSize: 14,
              textAlign: "left",
            }}
            buttonStyle={{ height: 40, width: "100%", borderRadius: 8 }}
            data={valuta}
            onSelect={(selectedItem, index) => {
              setCurrency(index);
            }}
            rowStyle={{
              flex: 1,
              justifyContent: "space-between",
              backgroundColor: "white",
              borderBottomColor: "white",
            }}
            rowTextStyle={{
              textAlign: "left",
              fontSize: 16,
            }}
          />
        </View>
        <AccordionItem
          titleComponent={
            <Text style={styles.selectText}>
              {fromCityName ? fromCityName : "Город расположения"}
            </Text>
          }
          wrapperStyle={openCitys ? styles.openModal : styles.select}
          headerStyle={styles.selectHeader}
          arrowStyle={styles.selectArrowStyle}
          isopenModal={openCitysModal}
        >
          <View style={styles.citysSearch}>
            <DelayInput
              placeholder="Search"
              value={searchValue}
              minLength={1}
              onChangeText={(text) => setSearchValue(text)}
              delayTimeout={500}
              style={styles.searchInput}
            />
          </View>
          <FlatList
            nestedScrollEnabled
            data={citys}
            keyExtractor={(item) => item.last_id}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setFromCityName(item?.title?.ru || item.title);
                    setFrom_city(item.last_id);
                  }}
                >
                  <Text style={{ marginBottom: 8 }}>
                    {item.title.ru || item.title}
                  </Text>
                </TouchableOpacity>
              );
            }}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={20}
          />
        </AccordionItem>
        <View style={styles.containerStyle}>
          <SelectDropdown
            searchInputStyle={{
              borderColor: "black",
              borderWidth: 0.2,
              marginVertical: 10,
              height: 40,
            }}
            ref={DropDownRef}
            dropdownIconPosition="right"
            renderDropdownIcon={() => {
              return (
                <Entypo name="chevron-small-down" size={32} color={COLOR_1} />
              );
            }}
            defaultButtonText="Состояние"
            buttonTextStyle={{
              color: COLOR_1,
              fontSize: 14,
              textAlign: "left",
            }}
            buttonStyle={{ height: 40, width: "100%", borderRadius: 8 }}
            data={conditations}
            onSelect={(selectedItem, index) => {
              setConditation(selectedItem);
            }}
            rowStyle={{
              flex: 1,
              justifyContent: "space-between",
              backgroundColor: "white",
              borderBottomColor: "white",
            }}
            rowTextStyle={{
              textAlign: "left",
              fontSize: 16,
            }}
          />
        </View>
        <TouchableOpacity onPress={pickImage}>
          <Text
            style={{
              fontFamily: "GothamProRegular",
              color: COLOR_1,
              marginVertical: 40,
            }}
          >
            Добавить фото
          </Text>
        </TouchableOpacity>
        {selectedImage ? (
          <View>
            <Image source={{ uri: selectedImage }} style={styles.imageStyle} />
            <TouchableOpacity
              onPress={() => setSelectedImage("")}
              style={styles.cancelImage}
            >
              <Text style={{ color: "red" }}>X</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <MyInput
          label={"Описание"}
          value={comment}
          onChangeText={(val) => setComment(val)}
          style={styles.commentInput}
          multiline
        />
        <View style={styles.containerStyle}>
          <SelectDropdown
            searchInputStyle={{
              borderColor: "black",
              borderWidth: 0.2,
              marginVertical: 10,
              height: 40,
            }}
            ref={DropDownRef}
            dropdownIconPosition="right"
            renderDropdownIcon={() => {
              return (
                <Entypo name="chevron-small-down" size={32} color={COLOR_1} />
              );
            }}
            defaultButtonText="Условия оплаты"
            buttonTextStyle={{
              color: COLOR_1,
              fontSize: 14,
              textAlign: "left",
            }}
            buttonStyle={{ height: 40, width: "100%", borderRadius: 8 }}
            data={typespay}
            onSelect={(selectedItem, index) => {
              setTypePay(selectedItem);
            }}
            rowStyle={{
              flex: 1,
              justifyContent: "space-between",
              backgroundColor: "white",
              borderBottomColor: "white",
            }}
            rowTextStyle={{
              textAlign: "left",
              fontSize: 16,
            }}
          />
        </View>
        <View style={styles.containerStyle}>
          <SelectDropdown
            searchInputStyle={{
              borderColor: "black",
              borderWidth: 0.2,
              marginVertical: 10,
              height: 40,
            }}
            ref={DropDownRef}
            dropdownIconPosition="right"
            defaultButtonText="Реестр РЖД"
            renderDropdownIcon={() => {
              return (
                <Entypo name="chevron-small-down" size={32} color={COLOR_1} />
              );
            }}
            buttonTextStyle={{
              color: COLOR_1,
              fontSize: 14,
              textAlign: "left",
            }}
            buttonStyle={{ height: 40, width: "100%", borderRadius: 8 }}
            data={reestrized}
            onSelect={(selectedItem, index) => {
              setRestrict(selectedItem);
            }}
            rowStyle={{
              flex: 1,
              justifyContent: "space-between",
              backgroundColor: "white",
              borderBottomColor: "white",
            }}
            rowTextStyle={{
              textAlign: "left",
              fontSize: 16,
            }}
          />
        </View>
      </>
    );
  };

  const extraditionKTK = () => {
    return (
      <>
        <AccordionItem
          titleComponent={
            <Text style={styles.selectText}>
              {fromCityName ? fromCityName : "Откуда"}
            </Text>
          }
          wrapperStyle={openCitys ? styles.openModal : styles.select}
          headerStyle={styles.selectHeader}
          arrowStyle={styles.selectArrowStyle}
          isopenModal={openCitysModal}
        >
          <View style={styles.citysSearch}>
            <DelayInput
              placeholder="Search"
              value={searchValue}
              minLength={1}
              onChangeText={(text) => setSearchValue(text)}
              delayTimeout={500}
              style={styles.searchInput}
            />
          </View>
          <FlatList
            data={citys}
            keyExtractor={(item) => item.last_id}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setFromCityName(item?.title?.ru || item.title);
                    setFrom_city(item.last_id);
                  }}
                >
                  <Text style={{ marginBottom: 8 }}>
                    {item.title.ru || item.title}
                  </Text>
                </TouchableOpacity>
              );
            }}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={20}
          />
        </AccordionItem>
        <AccordionItem
          titleComponent={
            <Text style={styles.selectText}>
              {toCityName ? toCityName : "Куда"}
            </Text>
          }
          wrapperStyle={openCitysFrom ? styles.openModal : styles.select}
          headerStyle={styles.selectHeader}
          arrowStyle={styles.selectArrowStyle}
          isopenModal={openCytysFromModal}
        >
          <View style={styles.citysSearch}>
            <DelayInput
              placeholder="Search"
              value={searchValue}
              minLength={1}
              onChangeText={(text) => setSearchValue(text)}
              delayTimeout={500}
              style={styles.searchInput}
            />
          </View>
          <FlatList
            data={citys}
            keyExtractor={(item) => item.last_id}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setToCityName(item?.title?.ru || item.title);
                    setTo_city(item.last_id);
                  }}
                >
                  <Text style={{ marginBottom: 8 }}>
                    {item.title.ru || item.title}
                  </Text>
                </TouchableOpacity>
              );
            }}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={20}
          />
        </AccordionItem>
        <View style={styles.containerStyle}>
          <SelectDropdown
            searchInputStyle={{
              borderColor: "black",
              borderWidth: 0.2,
              marginVertical: 10,
              height: 40,
            }}
            ref={DrowDownTypeContainerRef}
            dropdownIconPosition="right"
            renderDropdownIcon={() => {
              return (
                <Entypo name="chevron-small-down" size={32} color={COLOR_1} />
              );
            }}
            defaultButtonText="Выберите тип контейнера"
            buttonTextStyle={{
              color: COLOR_1,
              fontSize: 14,
              textAlign: "left",
            }}
            buttonStyle={{ height: 40, width: "100%", borderRadius: 8 }}
            search
            data={container}
            onSelect={(selectedItem, index) => {
              setTypeContiner(index);
            }}
            rowStyle={{
              flex: 1,
              justifyContent: "space-between",
              backgroundColor: "white",
              borderBottomColor: "white",
            }}
            rowTextStyle={{
              textAlign: "left",
              fontSize: 16,
            }}
          />
        </View>
        <MyInput
          label={"Количество контейнеров"}
          value={containerCount}
          onChangeText={(val) => setContainerCount(val)}
          keyboardType={"numeric"}
        />
        <DatePicker
          body="Cрок"
          date={date}
          setDate={(event, date) => {
            setShowDatePicker(false);
            return setDate(date);
          }}
        />
        <MyInput
          label={"Ставка"}
          value={price}
          onChangeText={(val) => setPrice(val)}
          keyboardType={"numeric"}
        />
        <View style={styles.containerStyle}>
          <SelectDropdown
            ref={DropDownRef}
            renderDropdownIcon={() => {
              return (
                <Entypo name="chevron-small-down" size={32} color={COLOR_1} />
              );
            }}
            dropdownIconPosition="right"
            defaultButtonText="Валюта"
            buttonTextStyle={{
              color: COLOR_1,
              fontSize: 14,
              textAlign: "left",
            }}
            buttonStyle={{ height: 40, width: "100%", borderRadius: 8 }}
            data={valuta}
            onSelect={(selectedItem, index) => {
              setCurrency(index);
            }}
            rowStyle={{
              flex: 1,
              justifyContent: "space-between",
              backgroundColor: "white",
              borderBottomColor: "white",
            }}
            rowTextStyle={{
              textAlign: "left",
              fontSize: 16,
            }}
          />
        </View>
      </>
    );
  };

  const trainService = () => {
    return (
      <>
        <AccordionItem
          titleComponent={
            <Text style={styles.selectText}>
              {fromCityName ? fromCityName : "Откуда"}
            </Text>
          }
          wrapperStyle={openCitys ? styles.openModal : styles.select}
          headerStyle={styles.selectHeader}
          arrowStyle={styles.selectArrowStyle}
          isopenModal={openCitysModal}
        >
          <View style={styles.citysSearch}>
            <DelayInput
              placeholder="Search"
              value={searchValue}
              minLength={1}
              onChangeText={(text) => setSearchValue(text)}
              delayTimeout={500}
              style={styles.searchInput}
            />
          </View>
          <FlatList
            data={citys}
            keyExtractor={(item) => item.last_id}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setFromCityName(item?.title?.ru || item.title);
                    setFrom_city(item.last_id);
                  }}
                >
                  <Text style={{ marginBottom: 8 }}>
                    {item.title.ru || item.title}
                  </Text>
                </TouchableOpacity>
              );
            }}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={20}
          />
        </AccordionItem>
        <AccordionItem
          titleComponent={
            <Text style={styles.selectText}>
              {toCityName ? toCityName : "Куда"}
            </Text>
          }
          wrapperStyle={openCitysFrom ? styles.openModal : styles.select}
          headerStyle={styles.selectHeader}
          arrowStyle={styles.selectArrowStyle}
          isopenModal={openCytysFromModal}
        >
          <View style={styles.citysSearch}>
            <DelayInput
              placeholder="Search"
              value={searchValue}
              minLength={1}
              onChangeText={(text) => setSearchValue(text)}
              delayTimeout={500}
              style={styles.searchInput}
            />
          </View>
          <FlatList
            data={citys}
            keyExtractor={(item) => item.last_id}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setToCityName(item?.title?.ru || item.title);
                    setTo_city(item.last_id);
                  }}
                >
                  <Text style={{ marginBottom: 8 }}>
                    {item.title.ru || item.title}
                  </Text>
                </TouchableOpacity>
              );
            }}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={20}
          />
        </AccordionItem>
        <View style={styles.containerStyle}>
          <SelectDropdown
            searchInputStyle={{
              borderColor: "black",
              borderWidth: 0.2,
              marginVertical: 10,
              height: 40,
            }}
            ref={DrowDownTypeContainerRef}
            dropdownIconPosition="right"
            renderDropdownIcon={() => {
              return (
                <Entypo name="chevron-small-down" size={32} color={COLOR_1} />
              );
            }}
            defaultButtonText="Выберите тип контейнера"
            buttonTextStyle={{
              color: COLOR_1,
              fontSize: 14,
              textAlign: "left",
            }}
            buttonStyle={{ height: 40, width: "100%", borderRadius: 8 }}
            search
            data={container}
            onSelect={(selectedItem, index) => {
              setTypeContiner(index);
            }}
            rowStyle={{
              flex: 1,
              justifyContent: "space-between",
              backgroundColor: "white",
              borderBottomColor: "white",
            }}
            rowTextStyle={{
              textAlign: "left",
              fontSize: 16,
            }}
          />
        </View>
        <MyInput
          label={"Количество контейнеров"}
          value={containerCount}
          onChangeText={(val) => setContainerCount(val)}
          keyboardType={"numeric"}
        />
        <DatePicker
          body="Cрок"
          date={date}
          setDate={(event, date) => {
            setShowDatePicker(false);
            return setDate(date);
          }}
        />
        <MyInput
          label={"Ставка"}
          value={price}
          onChangeText={(val) => setPrice(val)}
          keyboardType={"numeric"}
        />
        <View style={styles.containerStyle}>
          <SelectDropdown
            ref={DropDownRef}
            defaultButtonText="Валюта"
            dropdownIconPosition="right"
            renderDropdownIcon={() => {
              return (
                <Entypo name="chevron-small-down" size={32} color={COLOR_1} />
              );
            }}
            buttonTextStyle={{
              color: COLOR_1,
              fontSize: 14,
              textAlign: "left",
            }}
            buttonStyle={{ height: 40, width: "100%", borderRadius: 8 }}
            data={valuta}
            onSelect={(selectedItem, index) => {
              setCurrency(index);
            }}
            rowStyle={{
              flex: 1,
              justifyContent: "space-between",
              backgroundColor: "white",
              borderBottomColor: "white",
            }}
            rowTextStyle={{
              textAlign: "left",
              fontSize: 16,
            }}
          />
        </View>
      </>
    );
  };

  const applicationOnTEO = () => {
    return (
      <>
        <AccordionItem
          titleComponent={
            <Text style={styles.selectText}>
              {fromCityName ? fromCityName : "Откуда"}
            </Text>
          }
          wrapperStyle={openCitys ? styles.openModal : styles.select}
          headerStyle={styles.selectHeader}
          arrowStyle={styles.selectArrowStyle}
          isopenModal={openCitysModal}
        >
          <View style={styles.citysSearch}>
            <DelayInput
              placeholder="Search"
              value={searchValue}
              minLength={1}
              onChangeText={(text) => setSearchValue(text)}
              delayTimeout={500}
              style={styles.searchInput}
            />
          </View>
          <FlatList
            data={citys}
            keyExtractor={(item) => item.last_id}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setFromCityName(item?.title?.ru || item.title);
                    setFrom_city(item.last_id);
                  }}
                >
                  <Text style={{ marginBottom: 8 }}>
                    {item.title.ru || item.title}
                  </Text>
                </TouchableOpacity>
              );
            }}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={20}
          />
        </AccordionItem>
        <AccordionItem
          titleComponent={
            <Text style={styles.selectText}>
              {toCityName ? toCityName : "Куда"}
            </Text>
          }
          wrapperStyle={openCitysFrom ? styles.openModal : styles.select}
          headerStyle={styles.selectHeader}
          arrowStyle={styles.selectArrowStyle}
          isopenModal={openCytysFromModal}
        >
          <View style={styles.citysSearch}>
            <DelayInput
              placeholder="Search"
              value={searchValue}
              minLength={1}
              onChangeText={(text) => setSearchValue(text)}
              delayTimeout={500}
              style={styles.searchInput}
            />
          </View>
          <FlatList
            data={citys}
            keyExtractor={(item) => item.last_id}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setToCityName(item?.title?.ru || item.title);
                    setTo_city(item.last_id);
                  }}
                >
                  <Text style={{ marginBottom: 8 }}>
                    {item.title.ru || item.title}
                  </Text>
                </TouchableOpacity>
              );
            }}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={20}
          />
        </AccordionItem>
        <View style={styles.containerStyle}>
          <SelectDropdown
            searchInputStyle={{
              borderColor: "black",
              borderWidth: 0.2,
              marginVertical: 10,
              height: 40,
            }}
            ref={DrowDownTypeContainerRef}
            dropdownIconPosition="right"
            renderDropdownIcon={() => {
              return (
                <Entypo name="chevron-small-down" size={32} color={COLOR_1} />
              );
            }}
            defaultButtonText="Выберите тип контейнера"
            buttonTextStyle={{
              color: COLOR_1,
              fontSize: 14,
              textAlign: "left",
            }}
            buttonStyle={{ height: 40, width: "100%", borderRadius: 8 }}
            search
            data={container}
            onSelect={(selectedItem, index) => {
              setTypeContiner(index);
            }}
            rowStyle={{
              flex: 1,
              justifyContent: "space-between",
              backgroundColor: "white",
              borderBottomColor: "white",
            }}
            rowTextStyle={{
              textAlign: "left",
              fontSize: 16,
            }}
          />
        </View>
        <MyInput
          label={"Количество контейнеров"}
          value={containerCount}
          onChangeText={(val) => setContainerCount(val)}
          keyboardType={"numeric"}
        />
        <DatePicker
          body="Cрок"
          date={date}
          setDate={(event, date) => {
            setShowDatePicker(false);
            return setDate(date);
          }}
        />
        <MyInput
          label={"Груз"}
          value={weight}
          onChangeText={(val) => setWeight(val)}
        />
        <MyInput
          label={"Комментарий"}
          value={comment}
          onChangeText={(val) => setComment(val)}
          style={styles.commentInput}
          multiline
        />
      </>
    );
  };

  const filtered = (searchText) => {
    setCitys(
      allCitys?.filter((c) => {
        return c?.title?.ru?.includes(searchText);
      })
    );
  };

  return (
    <Wrapper
      withContainer
      header={{
        currentPage,
        home: false,
        navigation,
        onSavePress: save,
      }}
    >
      <NavBar
        tabs={secondaryTabs}
        activeTab={activeSecondaryTab}
        onPress={(tab) => {
          resetData();
          setActiveSecondaryTab(tab);
        }}
        secondary
      />
      <View style={styles.wrapper}>
        {activeSecondaryTab === "Поиск КТК"
          ? searchKTK()
          : activeSecondaryTab === "Продажа КТК"
          ? sellKTK()
          : activeSecondaryTab === "Выдача КТК"
          ? extraditionKTK()
          : activeSecondaryTab === "Поездной сервис"
          ? trainService()
          : activeSecondaryTab === "Заявка на ТЭО"
          ? applicationOnTEO()
          : null}
        <BlockWithSwitchButton
          title={"Сохранить как черновик"}
          titleStyle={styles.selectText}
          onToggle={(val) => setSaveAsDraft(val)}
          isOn={saveAsDraft}
        />
        <MyButton onPress={save} style={styles.button}>
          Разместить
        </MyButton>
      </View>
      {loading && (
        <Modal backdropOpacity={0.75} isVisible={true}>
          <View>
            <ActivityIndicator size="large" />
          </View>
        </Modal>
      )}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: WRAPPER_PADDINGS,
  },
  containerStyle: {
    marginBottom: 20,
    backgroundColor: COLOR_10,
    borderRadius: 6,
    height: 46,
    borderTopColor: "transparent",
    borderTopWidth: 1,
  },
  openModal: {
    height: 200,
    marginBottom: 100,
  },
  commentInput: {
    height: undefined,
    color: COLOR_8,
    fontSize: 14,
    fontFamily: "GothamProRegular",
  },
  select: {
    backgroundColor: COLOR_10,
    borderRadius: 10,
    marginBottom: 20,
  },
  selectText: {
    color: COLOR_1,
    fontSize: 12,
    fontFamily: "GothamProMedium",
  },
  selectHeader: {
    borderBottomWidth: 0,
    paddingHorizontal: 10,
    paddingVertical: 18,
  },

  selectArrowStyle: {
    top: 20,
    right: 14,
  },
  button: {
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  imageStyle: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancelImage: {
    color: "red",
    marginLeft: 5,
  },
  citysSearch: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: COLOR_1,
    borderRadius: 5,
    height: 30,
    marginBottom: 8,
    padding: 5,
    marginRight: 8,
  },
});

export default CreatingApplication;
