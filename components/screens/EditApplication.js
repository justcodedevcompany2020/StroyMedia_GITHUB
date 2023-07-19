import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import Wrapper from "../helpers/Wrapper";
import MyInput from "../includes/MyInput";
import {
  COLOR_1,
  COLOR_10,
  COLOR_8,
  WRAPPER_PADDINGS,
} from "../helpers/Variables";
import AccordionItem from "../includes/AccordionItem";
import BlockWithSwitchButton from "../includes/BlockWithSwitchButton";
import { useDispatch, useSelector } from "react-redux";
import { editAplicationsRequest } from "../../store/reducers/editAplicationsSlice";
import { getCitys } from "../../store/reducers/getCitysSlice";
import { showMessage } from "react-native-flash-message";
import Modal from "react-native-modal";
import DelayInput from "react-native-debounce-input";

import DatePicker from "../includes/DatePicker";
import MyButton from "../includes/MyButton";
import SelectDropdown from "react-native-select-dropdown";
import { sendCatRequest } from "../../store/reducers/sendCatSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authRequest } from "../../store/reducers/authUserSlice";
import { Entypo } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import _ from "lodash";
import { addArchiveApplicationRequest } from "../../store/reducers/addArchiveApplicationSlice";

const container = ["40 ST", "20 (30)", "20 (24)", "40 HQ"];
const valuta = ["₽", "€", "$"];
const conditations = ["Б/у", "Новый"];
const typespay = ["Любой вариант", "безналичный расчет", "наличный расчет"];
const reestrized = ["исключен", "включен"];

function EditApplication() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const {
    currentPage,
    activeSecondaryTab,
    typeKTK,
    user,
    token,
    last_id,
    price_,
    count_,
    to_city_,
    from_city_,
    activeTab,
    decription,
    img,
    valut,
    paymentType,
    reestrrzhd_,
    condition_,
    to_city_id,
    from_city_id,
    cargo,
    comment_,
  } = route.params;
  let activeSecondary = activeSecondaryTab.hasOwnProperty("ru")
    ? activeSecondaryTab.ru
    : activeSecondaryTab;

  const [citys, setCitys] = useState();
  const [fromCityName, setFromCityName] = useState(from_city_);
  const [toCityName, setToCityName] = useState(to_city_);
  const [openCitys, setOpenCitys] = useState(false);
  const [openCitysFrom, setOpenCitysFrom] = useState(false);
  const [containerCount, setContainerCount] = useState(count_);
  const [price, setPrice] = useState(price_);
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [from_city, setFrom_city] = useState(from_city_id);
  const [to_city, setTo_city] = useState(to_city_id);
  const [searchValue, setSearchValue] = useState("");
  const [date, setDate] = useState(new Date());
  const [comment, setComment] = useState(decription || comment_);
  const [showDatePicker, setShowDatePicker] = useState("");
  const [currency, setCurrency] = useState(valut);
  const [weight, setWeight] = useState(cargo);
  const state = useSelector((state1) => state1);
  const [conditation, setConditation] = useState(condition_);
  const [typePay, setTypePay] = useState(paymentType);
  const [restrict, setRestrict] = useState(
    reestrrzhd_ == "исключен" ? "исключен" : "включен"
  );
  const [selectedImage, setSelectedImage] = useState(
    img === "string"
      ? "https://teus.online" + img
      : Array.isArray(img)
      ? "https://teus.online" + img[0]?.url
      : selectedImage || null
  );
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [loading, setLoading] = useState(false);
  const DropDownRef = useRef({});
  const DrowDownTypeContainerRef = useRef({});
  const [typeContainer, setTypeContiner] = useState(typeKTK);
  const [saveAsArchive, setSaveAsArchive] = useState(false);

  let allCitys = useSelector(
    (state) => state.getCitysSlice?.data?.data?.data?.citys
  );

  const filtered = (searchText) => {
    setCitys(
      allCitys?.filter((c) => {
        return c?.title?.ru?.includes(searchText);
      })
    );
  };

  useEffect(() => {
    activeTab !== "В работе" && setSaveAsDraft(true);
  }, [route]);

  const pickImage = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: ["image/*"],
    });

    const { type, uri, mimeType, size, name } = result;

    if (size < 500000) {
      if (type === "success") {
        setSelectedImage(uri);
        setFileName(name);
        setFileType(mimeType);
      }
    } else {
      showMessage({
        type: "info",
        message: "Размер фото не должен превышать 5 МВ",
        color: "green",
      });
    }
  };

  const save = () => {
    let changed_tab = "";
    let payType = "";
    let new_or_used = "";
    let restrick = "";
    let price_type = "";
    let typeKTK = "";

    if (activeSecondaryTab == "Продажа КТК") {
      changed_tab = "5";
    } else if (activeSecondaryTab == "Поиск КТК") {
      changed_tab = "2";
    } else if (activeSecondaryTab == "Выдача КТК") {
      changed_tab = "3";
    } else if (activeSecondaryTab == "Поездной сервис") {
      changed_tab = "6";
    } else if (activeSecondaryTab == "Заявка на ТЭО") {
      changed_tab = "7";
    }

    if (typePay == "Любой вариант") {
      payType = "4";
    } else if (typePay == "безналичный расчет") {
      payType = "3";
    } else if (typePay == "наличный расчет") {
      payType = "2";
    }

    if (conditation == "Б/у") {
      new_or_used = "3";
    } else if (conditation == "Новый") {
      new_or_used = "2";
    }

    if (restrict == "исключен") {
      restrick = "3";
    } else if (restrict == "включен") {
      restrick = "2";
    }

    if (currency == "₽") {
      price_type = "1";
    } else if (currency == "$") {
      price_type = "2";
    } else if (currency == "€") {
      price_type = "3";
    }

    if (typeContainer == "40 ST") {
      typeKTK = "4";
    } else if (typeContainer == "20 (30)") {
      typeKTK = "4";
    } else if (typeContainer == "40 HQ") {
      typeKTK = "3";
    } else if (typeContainer == "20 (24)") {
      typeKTK = "2";
    }

    let myHeaders = new Headers();
    let formdata = new FormData();
    myHeaders.append("Content-Type", "multipart/form-data");

    let checkValues = {
      token,
      last_id,
      price,
      from_city,
      new_or_used,
      comment,
      payType,
      restrick,
      typeKTK,
      price_type,
      user: user.last_id,
      selectedImage,
      count_,
    };
    setLoading(true);
    if (activeSecondary === "Продажа КТК") {
      if (_.every(Object.values(checkValues))) {
        formdata.append("secret_token", token);
        formdata.append("last_id", last_id);
        formdata.append("price", price);
        formdata.append("dislokaciya", from_city);
        formdata.append("condition", new_or_used);
        formdata.append("description", comment);
        formdata.append("typepay", payType);
        formdata.append("reestrrzhd", restrick);
        formdata.append("type_container", typeKTK);
        formdata.append("currency", price_type);
        formdata.append("responsible", user.last_id.toString());
        formdata.append("img[]", {
          uri: selectedImage,
          name: "photo.png",
          filename: "imageName.png",
          type: "image/png",
        });
        formdata.append("count", containerCount);
        formdata.append("_type_op", saveAsDraft ? "draft" : "onwork");

        dispatch(
          editAplicationsRequest({
            formdata,
            myHeaders,
          })
        )
          .unwrap()
          .then((res) => {
            setLoading(false);
            if (res?.success) {
              navigation.navigate("MyApplications", {
                currentPage: "Мои заявки",
              });
            }
          })
          .catch((e) => {
            setLoading(false);
            showMessage({
              message: "Все поля должны быть заполнены",
              type: "danger",
            });
          });
      } else if (!_.every(Object.values(checkValues))) {
        setLoading(false);
        showMessage({
          message: "Все поля должны быть заполнены",
          type: "danger",
        });
      }
    }

    let checkValues1 = {
      token,
      last_id,
      from_city,
      to_city,
      containerCount,
      date,
      date,
      price,
      typeKTK,
      price_type,
      user,
    };
    if (
      activeSecondaryTab !== "Продажа КТК" &&
      activeSecondaryTab !== "Заявка на ТЭО"
    ) {
      if (_.every(Object.values(checkValues1))) {
        formdata.append("secret_token", token);
        formdata.append("last_id", last_id);
        formdata.append("from_city", from_city);
        formdata.append("to_city", to_city);
        formdata.append("count", containerCount);
        formdata.append("date_shipment", date.toString());
        formdata.append("period", date.toString());
        formdata.append("price", price);
        formdata.append("type_container", typeKTK);
        formdata.append("currency", price_type);
        formdata.append("responsible", user.last_id.toString());
        formdata.append("_type_op", saveAsDraft ? "draft" : "onwork");

        dispatch(
          editAplicationsRequest({
            formdata,
            myHeaders,
          })
        )
          .unwrap()
          .then((e) => {
            setLoading(false);
            if (e.success)
              navigation.navigate("MyApplications", {
                currentPage: "Мои заявки",
              });
          })
          .catch((e) => {
            setLoading(false);
            showMessage({
              message: "Все поля должны быть заполнены",
              type: "danger",
            });
          });
      } else if (_.every(Object.values(checkValues1))) {
        setLoading(false);
        showMessage({
          message: "Все поля должны быть заполнены",
          type: "danger",
        });
      }
    }

    let checkValues2 = {
      token,
      from_city,
      to_city,
      containerCount,
      date,
      weight,
      comment,
      typeKTK,
      user: user?.last_id,
    };
    if (activeSecondaryTab === "Заявка на ТЭО") {
      if (_.every(Object.values(checkValues2))) {
        formdata.append("secret_token", token);
        formdata.append("last_id", last_id);
        formdata.append("from_city", from_city.toString());
        formdata.append("to_city", to_city.toString());
        formdata.append("count", containerCount);
        formdata.append("date_shipment", date.toString());
        formdata.append("cargo", weight);
        formdata.append("comment", comment);
        formdata.append("type_container", typeKTK);
        formdata.append("responsible", user?.last_id.toString());
        formdata.append("_type_op", saveAsDraft ? "draft" : "onwork");

        dispatch(
          editAplicationsRequest({
            formdata,
            myHeaders,
          })
        )
          .unwrap()
          .then((e) => {
            setLoading(false);
            if (e.success) {
              navigation.navigate("MyApplications", {
                currentPage: "Мои заявки",
              });
            } else {
              setLoading(false);
              showMessage({
                message: "Все поля должны быть заполнены",
                type: "danger",
              });
            }
          })
          .catch((e) => {
            setLoading(false);
            showMessage({
              message: "Все поля должны быть заполнены",
              type: "danger",
            });
          });
      } else if (!_.every(Object.values(checkValues2))) {
        setLoading(false);
        showMessage({
          message: "Все поля должны быть заполнены",
          type: "danger",
        });
      }
    }
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

  const openCitysModal = () => {
    setOpenCitys(!openCitys);
  };

  const openCytysFromModal = () => {
    setOpenCitysFrom(!openCitysFrom);
  };

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
            nestedScrollEnabled={true}
            scrollEnabled={true}
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
            nestedScrollEnabled={true}
            scrollEnabled={true}
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
            buttonStyle={{
              height: 40,
              width: "100%",
              borderRadius: 8,
            }}
            // search
            data={container}
            defaultValue={typeContainer}
            onSelect={(selectedItem, index) => {
              setTypeContiner(selectedItem);
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
            buttonStyle={{
              height: 40,
              width: "100%",
              borderRadius: 8,
            }}
            data={valuta}
            defaultValue={currency}
            onSelect={(selectedItem, index) => {
              setCurrency(selectedItem);
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
            buttonStyle={{
              height: 40,
              width: "100%",
              borderRadius: 8,
            }}
            // search
            data={container}
            defaultValue={typeContainer}
            onSelect={(selectedItem, index) => {
              setTypeContiner(selectedItem);
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
            buttonStyle={{
              height: 40,
              width: "100%",
              borderRadius: 8,
            }}
            data={valuta}
            defaultValue={currency}
            onSelect={(selectedItem, index) => {
              setCurrency(selectedItem);
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
            nestedScrollEnabled={true}
            scrollEnabled={true}
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
            buttonStyle={{
              height: 40,
              width: "100%",
              borderRadius: 8,
            }}
            data={conditations}
            defaultValue={conditation}
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
              marginBottom: selectedImage ? 20 : 40,
            }}
          >
            Добавить фото
          </Text>
        </TouchableOpacity>
        {selectedImage ? (
          <View>
            <Image
              source={{
                uri: selectedImage,
              }}
              style={styles.imageStyle}
            />
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
            defaultValue={typePay}
            buttonTextStyle={{
              color: COLOR_1,
              fontSize: 14,
              textAlign: "left",
            }}
            buttonStyle={{
              height: 40,
              width: "100%",
              borderRadius: 8,
            }}
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
            buttonStyle={{
              height: 40,
              width: "100%",
              borderRadius: 8,
            }}
            data={reestrized}
            defaultValue={restrict}
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
            nestedScrollEnabled={true}
            scrollEnabled={true}
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
            nestedScrollEnabled={true}
            scrollEnabled={true}
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
            buttonStyle={{
              height: 40,
              width: "100%",
              borderRadius: 8,
            }}
            data={container}
            defaultValue={typeContainer}
            onSelect={(selectedItem, index) => {
              setTypeContiner(selectedItem);
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
            buttonStyle={{
              height: 40,
              width: "100%",
              borderRadius: 8,
            }}
            data={valuta}
            defaultValue={currency}
            onSelect={(selectedItem, index) => {
              setCurrency(selectedItem);
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
            nestedScrollEnabled={true}
            scrollEnabled={true}
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
            nestedScrollEnabled={true}
            scrollEnabled={true}
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
            buttonStyle={{
              height: 40,
              width: "100%",
              borderRadius: 8,
            }}
            data={container}
            defaultValue={typeContainer}
            onSelect={(selectedItem, index) => {
              setTypeContiner(selectedItem);
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
            buttonStyle={{
              height: 40,
              width: "100%",
              borderRadius: 8,
            }}
            data={valuta}
            defaultValue={currency}
            onSelect={(selectedItem, index) => {
              setCurrency(selectedItem);
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
            nestedScrollEnabled={true}
            scrollEnabled={true}
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
            nestedScrollEnabled={true}
            scrollEnabled={true}
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
            buttonStyle={{
              height: 40,
              width: "100%",
              borderRadius: 8,
            }}
            data={container}
            defaultValue={typeContainer}
            onSelect={(selectedItem, index) => {
              setTypeContiner(selectedItem);
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
      <View style={styles.wrapper}></View>
      <View style={styles.wrapper}>
        {activeSecondary === "Поиск КТК"
          ? searchKTK()
          : activeSecondary === "Продажа КТК"
          ? sellKTK()
          : activeSecondary === "Выдача КТК"
          ? extraditionKTK()
          : activeSecondary === "Поездной сервис"
          ? trainService()
          : activeSecondary === "Заявка на ТЭО"
          ? applicationOnTEO()
          : null}
        <BlockWithSwitchButton
          title={"Сохранить как черновик"}
          titleStyle={styles.selectText}
          onToggle={(val) => setSaveAsDraft(val)}
          isOn={saveAsDraft}
        />

        <BlockWithSwitchButton
          title={"Запрос закрыт"}
          titleStyle={styles.selectText}
          onToggle={(val) => {
            dispatch(addArchiveApplicationRequest({ token, last_id })).then(
              (res) => {
                if (res?.payload?.success) {
                  setSaveAsArchive(val);
                  showMessage({
                    message: "Ваша заявка успешно добавлена в архив",
                    type: "success",
                  });
                } else {
                  showMessage({
                    message: "Ваша заявка успешно добавлена в архив",
                    type: "success",
                  });
                }
              }
            );
          }}
          isOn={saveAsArchive}
          style={{ marginTop: 10 }}
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
    marginBottom: 20,
  },
  commentInput: {
    height: undefined,
    color: COLOR_8,
    fontSize: 10,
    fontFamily: "GothamProRegular",
  },
  containerStyle: {
    marginBottom: 20,
    backgroundColor: COLOR_10,
    borderRadius: 6,
    height: 46,
    borderTopColor: "transparent",
    borderTopWidth: 1,
  },
  select: {
    backgroundColor: COLOR_10,
    borderRadius: 10,
    marginBottom: 20,
  },

  selectText: {
    color: COLOR_1,
    fontSize: 12,
    fontFamily: "GothamProRegular",
  },
  openModal: {
    height: 200,
    marginBottom: 100,
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
  bold: {
    fontFamily: "GothamProMedium",
  },
  switchTitle: {
    color: COLOR_1,
    fontFamily: "GothamProMedium",
    fontSize: 10,
  },
  switchDescription: {
    marginTop: -2,
  },
  switch: {
    marginBottom: 20,
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
  imageStyle: {
    width: 80,
    height: 80,
    resizeMode: "cover",
  },
});

export default EditApplication;
