import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
  FlatList,
  TextInput,
} from "react-native";
import Wrapper from "../helpers/Wrapper";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import AccordionItem from "../includes/AccordionItem";
import MyInput from "../includes/MyInput";
import {
  COLOR_1,
  COLOR_2,
  COLOR_6,
  WRAPPER_PADDINGS,
} from "../helpers/Variables";
import BlockWithSwitchButton from "../includes/BlockWithSwitchButton";
import QRCode from "react-native-qrcode-generator";
import QrModal from "../includes/QrModal";
import { deleteUserRequest } from "../../store/reducers/deleteUserSlice";
import { offerMessageRequest } from "../../store/reducers/offerMessageSlice";
import { offerlNotificationRequest } from "../../store/reducers/offerNotificationSlice";
import { globallMessageRequest } from "../../store/reducers/globalMessageSlice";
import { globallNotificationRequest } from "../../store/reducers/globalNotificationSlice";
import { hideUserRequest } from "../../store/reducers/hideUserDataSlice";
import { personalMessageRequest } from "../../store/reducers/personalMessageSlice";
import { personalNotificationRequest } from "../../store/reducers/personalNotificationSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LogOutModal from "../includes/LogOutModal";
import * as Updates from "expo-updates";
import { logout } from "../../store/reducers/loginSlice";
import { editUserDataRequest } from "../../store/reducers/editUserDataSlice";
import { getCitys } from "../../store/reducers/getCitysSlice";
import { getCountrys } from "../../store/reducers/getCountrysSlice";
import SelectDropdown from "react-native-select-dropdown";
import { showMessage } from "react-native-flash-message";
import { BarCodeScanner } from "expo-barcode-scanner";
import { AntDesign } from "@expo/vector-icons";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import { MaterialIcons } from "@expo/vector-icons";
import DelayInput from "react-native-debounce-input";
import * as FileSystem from "expo-file-system";

const items = [
  {
    id: "owner",
    name: "Собственник КТК",
  },
  {
    id: "operatorkp",
    name: "Экспедитор",
  },
  {
    id: "ownerpc",
    name: "Собственник ПС",
  },
  {
    id: "ownercargo",
    name: "Грузовладелец",
  },
  {
    id: "sealine",
    name: "Морская линия",
  },
  {
    id: "other",
    name: "Другое...",
  },
];

const MyProfile = ({ route, navigation }) => {
  const { currentPage } = route.params;
  const user = useSelector((state) => state.authUserSlice.data.user);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [position, setPosoition] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [showToOthersPhone, setShowToOthersPhone] = useState(false);
  const [showToOthersEmail, setShowToOthersEmail] = useState(false);
  const [dontWorkInThisCompany, setDontWorkInThisCompany] = useState(false);
  const [dmEmail, setDmEmail] = useState("");
  const [dmPush, setDmPush] = useState("");
  const [groupMessagesEmail, setGroupMessagesEmail] = useState("");
  const [groupMessagesPush, setGroupMessagesPush] = useState("");
  const [newMessagesEmail, setNewMessagesEmail] = useState("");
  const [newMessagesPush, setNewMessagesPush] = useState("");
  const [hideProfile, setHideProfile] = useState("");
  const [deleteProfile, setDeleteProfile] = useState(false);
  const [site, setSicte] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [bigQr, setBigQr] = useState(false);
  const [rol, setRol] = useState();
  const [inn, setInn] = useState("");
  const [token, setToken] = useState("");
  const [citys, setCitys] = useState([]);
  const [cityNmae, setCytyName] = useState("");
  const [isOpenCitys, setIsOpenCitys] = useState(false);
  const [country, setCountry] = useState("");
  const [companyCity, setCompanyCity] = useState("");
  const [companyCityName, setCompanyCityName] = useState();
  const [openCompanyCity, setOpenCompanyCity] = useState(false);
  const [countrys, setCountrys] = useState();
  const [openCompanyCountry, setOpenCompanyCountry] = useState(false);
  const [companyCountryName, setCompanyCountryName] = useState();
  const [activeRole, setActiveRole] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [selectedItems, setselectedItems] = useState([]);
  const [fileSize, setFileSize] = useState();
  let allCitys = useSelector(
    (state) => state.getCitysSlice?.data?.data?.data?.citys
  );
  const dispatch = useDispatch();
  const [query, setQuery] = useState(false);
  function getImageFormat(str) {
    const afterDot = str?.substr(str?.indexOf(".") + 1);
    return afterDot;
  }

  const openCitysModal = () => {
    setIsOpenCitys(!isOpenCitys);
    setSearchValue("");
  };

  const getFileInfo = async (fileURI) => {
    const fileInfo = await FileSystem.getInfoAsync(fileURI);
    return fileInfo.size;
  };
  const openCompanyCitys = () => {
    setOpenCompanyCity(!openCompanyCity);
  };

  const openCompanyCountryModal = () => {
    setOpenCompanyCountry(!openCompanyCountry);
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      width: 120,
      height: 120,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0,
    });
    if (!result.canceled) {
      setFileSize(await getFileInfo(result.assets[0].uri));
      setImage(result);
    } else {
      console.log(await getFileInfo(result.assets[0].uri));
    }
  };

  useEffect(() => {
    setName(user?.contact_person);
    setPosoition(user?.post);
    setEmail(user?.email);
    setCompanyName(user?.name);
    setInn(user?.inn);
    setSicte(user?.site);
    const getCytys = () => {
      dispatch(getCitys())
        .unwrap()
        .then((result) => {
          setCitys(result.data.data.citys);
        });
    };
    getCytys();
  }, [user]);

  useEffect(() => {
    const getCountris = () => {
      dispatch(getCountrys())
        .unwrap()
        .then((result) => {
          setCountrys(result.data.data.countrys);
        });
    };
    getCountris();
  }, []);
  const countrysRenderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{ marginVertical: 5 }}
        onPress={() => {
          setCompanyCountryName(item.title.ru.replace(/\(RU\)/, ""));
          setCountry(item.last_id);
        }}
      >
        <Text>{item.title.ru}</Text>
      </TouchableOpacity>
    );
  };

  const save = () => {
    const data = new FormData();
    const avatar_person = {
      uri: image?.uri ? image?.uri : user?.avater,
      name: new Date().toISOString(),
      type: `image/jpeg`,
    };
    image?.uri && data.append("avatar_person", avatar_person);
    data.append("secret_token", token);
    data.append("post", position ? position : user?.post);
    data.append("hide_email", showToOthersEmail ? 1 : 0);
    data.append("hide_phone", showToOthersPhone ? 1 : 0);
    data.append("phone", phoneNumber ? phoneNumber : user?.phone);
    data.append("email", email ? email : user?.email);
    data.append("contact_person", name ? name : user?.contact_person);
    data.append("city_person", city ? city : user?.city_person?.last_id);
    data.append("name", companyName ? companyName : user?.name);
    data.append("inn", inn ? inn : user?.inn);
    data.append("site", site ? site : user?.site);
    data.append("not_work_here", dontWorkInThisCompany ? 1 : 0);
    data.append("country", country ? country : user?.country?.last_id);
    data.append("city", companyCity ? companyCity : user?.city?.last_id);
    selectedItems.length
      ? selectedItems.map((c, index) => {
          data.append("role[]", selectedItems[index]);
        })
      : Object.values(activeRole).map((c) => {
          if (c) {
            data.append("role[]", c);
          }
        });
    dispatch(editUserDataRequest(data))
      .unwrap()
      .then(() => {
        showMessage({
          message: "Ваш данные успешно сохранён",
          type: "success",
        });
      })
      .catch((e) => {
        if (image) {
          showMessage({
            message: "Пожалуйста, загрузите правильное фото",
            type: "danger",
          });
        } else {
          showMessage({
            message: "Ведите корректные данные",
            type: "danger",
          });
        }
      });
  };

  useEffect(() => {
    setHideProfile(user?.hide_person);
    const getToken = () => {
      try {
        AsyncStorage.getItem("token").then((token) => {
          setToken(token);
        });
        AsyncStorage.getItem("hide_person").then((result) => {
          if (result) {
            setHideProfile(result);
          }
        });
        AsyncStorage.getItem("personal_notify").then((result) => {
          if (result) {
            setDmPush(result);
          }
        });
        AsyncStorage.getItem("personal_message").then((result) => {
          if (result) {
            setDmEmail(result);
          }
        });
        AsyncStorage.getItem("global_message").then((result) => {
          if (result) {
            setGroupMessagesEmail(result);
          }
        });
        AsyncStorage.getItem("global_notify").then((result) => {
          if (result) {
            setGroupMessagesPush(result);
          }
        });
        AsyncStorage.getItem("offer_message").then((result) => {
          if (result) {
            setNewMessagesEmail(result);
          }
        });
        AsyncStorage.getItem("offer_notify").then((result) => {
          if (result) {
            setNewMessagesPush(result);
          }
        });
      } catch (error) {
        console.warn(error);
      }
    };

    getToken();
    // dispatch(authRequest({token:token}))
  }, []);

  const changeHide = async () => {
    try {
      AsyncStorage.setItem("hide_person", hideProfile === "1" ? "0" : "1");
      setHideProfile(await AsyncStorage.getItem("hide_person"));
    } catch (error) {
      console.warn(error);
    }
  };
  const changPersonlNotify = async () => {
    try {
      AsyncStorage.setItem("personal_notify", dmPush === "1" ? "0" : "1");
      setDmPush(await AsyncStorage.getItem("personal_notify"));
    } catch (error) {
      console.warn(error);
    }
  };
  const changPersonlMessage = async () => {
    try {
      AsyncStorage.setItem("personal_message", dmEmail === "1" ? "0" : "1");
      setDmEmail(await AsyncStorage.getItem("personal_message"));
    } catch (error) {
      console.warn(error);
    }
  };

  const changGlobalMessage = async () => {
    try {
      AsyncStorage.setItem(
        "global_message",
        groupMessagesEmail === "1" ? "0" : "1"
      );
      setGroupMessagesEmail(await AsyncStorage.getItem("global_message"));
    } catch (error) {
      console.warn(error);
    }
  };

  const changGlobalNotifuy = async () => {
    try {
      AsyncStorage.setItem(
        "global_notify",
        groupMessagesPush === "1" ? "0" : "1"
      );
      setGroupMessagesPush(await AsyncStorage.getItem("global_notify"));
    } catch (error) {
      console.warn(error);
    }
  };

  const changOfferMessage = async () => {
    try {
      AsyncStorage.setItem(
        "offer_message",
        newMessagesEmail === "1" ? "0" : "1"
      );
      setNewMessagesEmail(await AsyncStorage.getItem("offer_message"));
    } catch (error) {
      console.warn(error);
    }
  };

  const changOfferNotify = async () => {
    try {
      AsyncStorage.setItem("offer_notify", newMessagesPush === "1" ? "0" : "1");
      setNewMessagesPush(await AsyncStorage.getItem("offer_notify"));
    } catch (error) {
      console.warn(error);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setCytyName(
            !item.title.ru
              ? item.title.replace(/\(RU\)/, "")
              : item.title.ru.replace(/\(RU\)/, "")
          );
          setCity(item.last_id);
        }}
      >
        <Text style={{ marginBottom: 8 }}>{item.title.ru || item.title}</Text>
      </TouchableOpacity>
    );
  };

  const renderCompanyCitys = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setCompanyCityName(
            !item.title.ru
              ? item.title.replace(/\(RU\)/, "")
              : item.title.ru.replace(/\(RU\)/, "")
          );
          setCompanyCity(item.last_id);
        }}
      >
        <Text style={{ marginBottom: 8 }}>{item?.title?.ru || item.title}</Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    setShowToOthersPhone(user?.hide_phone === "0" || 0 ? false : true);
    setShowToOthersEmail(user?.hide_email === "0" || 0 ? false : true);
    setDontWorkInThisCompany(user?.not_work_here === "0" || 0 ? false : true);
    setActiveRole({
      other: user?.isother && "other",
      operatorkp: user?.isoperatorkp && "operatorkp",
      owner: user?.isowner && "owner",
      sealine: user?.issealine && "sealine",
      ownercargo: user?.isownercargo && "ownercargo",
      ownerpc: user?.isownerpc && "ownerpc",
    });
  }, [setShowToOthersPhone, user]);

  const hidePhone = () => {
    setShowToOthersPhone(!showToOthersPhone);
  };

  const hideEmail = () => {
    setShowToOthersEmail(!showToOthersEmail);
  };

  const dontWork = () => {
    setDontWorkInThisCompany(!dontWorkInThisCompany);
  };
  const filtered = (searchText) => {
    setQuery(true);
    setCitys(
      allCitys?.filter((c) => {
        return c?.title?.ru?.includes(searchText);
      })
    );
  };

  const onSelectedItemsChange = (selectedItems) => {
    setselectedItems(selectedItems);
  };
  useEffect(() => {
    filtered(searchValue);
  }, [searchValue]);

  // let phoneRegex = /^(?:\+1)?[^\d]*(\d{3})[^\d]*(\d{3})[^\d]*(\d{4})/g;
  // const phoneRegex = /[^0-9]/g;

  const handleChangePhoneNumber = (e) => {
    const regex = /^\+7\s\d{3}\s\d{3}-\d{2}-\d{2}$/g;
    setPhoneNumber(e.replace(regex));
  };

  return (
    <Wrapper
      withScrollView
      withContainer
      header={{
        currentPage,
        home: false,
        navigation,
        onSavePress: save,
      }}
    >
      <View style={styles.wrapper}>
        <AccordionItem
          headerStyle={styles.headerStyle}
          arrowStyle={styles.arrowStyle}
          titleComponent={
            <Text style={styles.header}>Персональные данные</Text>
          }
          childrenStyle={styles.block}
          expanded
        >
          <View style={styles.imageBlock}>
            <View style={styles.imageView}>
              <Image
                source={{
                  uri: image
                    ? image.uri
                    : user?.avatar_person
                    ? "https://teus.online/" + user?.avatar_person
                    : "https://vyshnevyi-partners.com/wp-content/uploads/2016/12/no-avatar.png",
                }}
                style={styles.image}
              />
            </View>
            <TouchableOpacity onPress={pickImage}>
              <Text style={styles.smallButton}>Изменить фото</Text>
            </TouchableOpacity>
          </View>
          <MyInput
            label={"ФИО"}
            value={name}
            placeholder={"Введите имя пользователя"}
            onChangeText={(name) => setName(name)}
          />
          <MyInput
            label={"Должность"}
            placeholder={"Введите Должность"}
            value={position}
            onChangeText={(position) => setPosoition(position)}
          />
          <MyInput
            label={"Номер телефона"}
            numberTel={true}
            phoneNumber={phoneNumber}
            placeholder={user?.phone}
            onChangeText={handleChangePhoneNumber}
            keyboardType={"phone-pad"}
          />
          <BlockWithSwitchButton
            title={"скрыть телефон"}
            titleStyle={styles.smallSwitchTitle}
            style={styles.switchBlock}
            isOn={showToOthersPhone}
            onToggle={(val) => {
              hidePhone();
            }}
          />
          <MyInput
            label={"E-mail"}
            placeholder={"Введите электронную почту"}
            value={email}
            onChangeText={(email) => setEmail(email)}
            keyboardType={"email-address"}
          />
          <BlockWithSwitchButton
            title={"скрыть электронную почту"}
            titleStyle={styles.smallSwitchTitle}
            style={styles.switchBlock}
            isOn={showToOthersEmail}
            onToggle={(val) => hideEmail()}
          />
          <View style={styles.dropDownCitys}>
            <AccordionItem
              titleComponent={
                <Text style={styles.selectText}>
                  {cityNmae
                    ? cityNmae
                    : user?.city_person?.title.ru.split(" ")[0] || "Город"}
                </Text>
              }
              wrapperStyle={{
                height: !isOpenCitys ? 40 : 200,
                marginBottom: isOpenCitys ? 50 : 0,
              }}
              headerStyle={styles.selectHeader}
              arrowStyle={styles.selectArrowStyle}
              isopenModal={openCitysModal}
            >
              <View style={styles.citysSearch}>
                <DelayInput
                  placeholder="Поиск"
                  value={searchValue}
                  minLength={1}
                  onChangeText={(text) => setSearchValue(text)}
                  delayTimeout={500}
                  style={styles.searchInput}
                />
              </View>
              <View style={{ marginBottom: 60 }}>
                {citys?.length === 0 && (
                  <Text style={styles.no_product}>Не найдено</Text>
                )}
                <FlatList
                  data={citys}
                  keyExtractor={(item) => item.last_id}
                  renderItem={renderItem}
                  maxToRenderPerBatch={10}
                  updateCellsBatchingPeriod={20}
                  nestedScrollEnabled
                />
              </View>
            </AccordionItem>
          </View>
        </AccordionItem>
        <AccordionItem
          headerStyle={styles.headerStyle}
          arrowStyle={styles.arrowStyle}
          titleComponent={<Text style={styles.header}>Компания</Text>}
          childrenStyle={styles.block}
        >
          <MyInput
            isGray
            label={"Название"}
            placeholder={"Введите название компании"}
            onChangeText={(val) => setCompanyName(val)}
            value={companyName}
          />
          <View style={styles.dropDownCountrys}>
            <AccordionItem
              titleComponent={
                <Text style={styles.selectText}>
                  {companyCityName
                    ? companyCityName
                    : user?.city?.title.ru.split(" ")[0] || "Город"}
                </Text>
              }
              wrapperStyle={{
                height: !openCompanyCity ? 20 : 200,
                marginBottom: openCompanyCity ? 60 : 20,
              }}
              headerStyle={styles.selectHeader}
              arrowStyle={styles.selectArrowStyle}
              isopenModal={openCompanyCitys}
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
              <View style={{ marginBottom: 60 }}>
                {!citys?.length && (
                  <Text style={styles.no_product}>Не найдено</Text>
                )}
                <FlatList
                  data={citys}
                  keyExtractor={(item) => item.last_id}
                  renderItem={renderCompanyCitys}
                  maxToRenderPerBatch={10}
                  updateCellsBatchingPeriod={20}
                />
              </View>
            </AccordionItem>
          </View>
          <View style={styles.dropDownCountrys}>
            <AccordionItem
              titleComponent={
                <Text style={styles.selectText}>
                  {companyCountryName
                    ? companyCountryName
                    : user?.country?.title.ru.split(" ")[0] || "Страна"}
                </Text>
              }
              wrapperStyle={{ height: openCompanyCountry ? 200 : 40 }}
              headerStyle={styles.selectHeader}
              arrowStyle={styles.selectArrowStyle}
              isopenModal={openCompanyCountryModal}
            >
              <FlatList
                style={{ height: "80%" }}
                data={countrys}
                keyExtractor={(item) => item.last_id}
                renderItem={countrysRenderItem}
                maxToRenderPerBatch={10}
                updateCellsBatchingPeriod={20}
              />
            </AccordionItem>
          </View>
          <MyInput
            isGray
            label={"ИНН"}
            placeholder={"Введите ИНН"}
            onChangeText={(val) => setInn(val)}
            value={inn}
            keyboardType="numeric"
          />
          <View
            style={
              !selectedItems.length
                ? styles.sectionSelect
                : selectedItems.length === 1 || selectedItems.length === 2
                ? { height: 130 }
                : selectedItems.length === 3 || selectedItems.length === 4
                ? { height: 170 }
                : selectedItems.length === 5 || selectedItems.length === 6
                ? { height: 210 }
                : { height: 70 }
            }
          >
            {!selectedItems.length && (
              <Text style={{ position: "absolute", left: 16, top: 16 }}>
                Профиль деятельности
              </Text>
            )}
            <SectionedMultiSelect
              hideTags
              items={items}
              uniqueKey="id"
              onSelectedItemsChange={onSelectedItemsChange}
              selectedItems={selectedItems}
              selectText="Профиль деятельности"
              onChangeInput={(text) => console.warn(text)}
              tagRemoveIconColor="#CCC"
              tagBorderColor="#CCC"
              tagTextColor="#CCC"
              selectedItemTextColor="#CCC"
              selectedItemIconColor="#CCC"
              itemTextColor="#000"
              displayKey="name"
              submitButtonColor="#CCC"
              submitButtonText="Submit"
              IconRenderer={MaterialIcons}
              searchPlaceholderText="Поиск категории"
              confirmText="Применить"
              icons={{
                search: {
                  name: "search",
                  size: 24,
                },
                check: {
                  name: "check",
                  size: 16,
                },
                close: {
                  name: "close",
                  size: 16,
                },
              }}
            />
          </View>
          {/* <View style={styles.dropDown}> */}
          <Text
            style={{
              fontSize: 12,
              marginBottom: 16,
              marginLeft: 16,
            }}
          >
            {/* {activeRole["operatorkp"] !== 0 && activeRole["operatorkp"] + " "} */}
            {/* {activeRole["other"] !== 0 && activeRole["other"] + " "} */}
            {/* {activeRole["owner"] !== 0 && activeRole["owner"] + " "} */}
            {/* {activeRole["ownercargo"] !== 0 && activeRole["ownercargo"] + " "} */}
            {/* {activeRole["ownerpc"] !== 0 && activeRole["ownerpc"] + " "} */}
            {/* {activeRole["sealine"] !== 0 && activeRole["sealine"] + " "} */}
          </Text>
          {/* </View> */}
          <MyInput
            isGray
            label={"Сайт компании"}
            placeholder={"Введите Сайт компании"}
            value={site}
            // style={styles.nonEditableInput}
            onChangeText={(site) => setSicte(site)}
          />
          <BlockWithSwitchButton
            title={"Я не работаю в данной компании"}
            titleStyle={styles.smallSwitchTitle}
            style={styles.switchBlock}
            isOn={dontWorkInThisCompany}
            onToggle={(val) => dontWork()}
          />
        </AccordionItem>
        <AccordionItem
          headerStyle={styles.headerStyle}
          arrowStyle={styles.arrowStyle}
          titleComponent={<Text style={styles.header}>QR-визитка</Text>}
          childrenStyle={styles.block}
        >
          <View style={styles.imageBlock}>
            <TouchableOpacity
              onPress={() => setBigQr(true)}
              style={[styles.imageView, styles.qrView]}
            >
              <QRCode
                value={JSON.stringify({
                  name: user?.contact_person,
                  position: user?.post,
                  phoneNumber: user?.phone,
                  email: user?.email,
                  city: user?.city_person?.title.ru,
                  companyName: user?.name,
                  image: "https://teus.online/" + user?.avatar_person,
                })}
                size={94}
                bgColor="black"
                fgColor="white"
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Text onPress={() => setBigQr(true)} style={styles.smallButton}>
                Отправить визитку
              </Text>
            </TouchableOpacity>
          </View>
          <QrModal
            onCancel={() => setBigQr(false)}
            value={"https://teus.online//"}
            isVisible={bigQr}
          />
        </AccordionItem>

        <AccordionItem
          headerStyle={styles.headerStyle}
          arrowStyle={styles.arrowStyle}
          titleComponent={
            <Text style={styles.header}>Настройка уведомлений</Text>
          }
          childrenStyle={styles.block}
        >
          <View style={styles.notificationsSection}>
            <BlockWithSwitchButton
              title={"Личные сообщения"}
              titleStyle={styles.bigSwitchTitle}
              style={[styles.switchBlock, styles.bigSwitch]}
              isButton={false}
              description={"Уведомления о новых сообщениях в диалогах"}
            />
            <BlockWithSwitchButton
              title={"Электронная почта"}
              titleStyle={styles.smallSwitchTitle}
              style={styles.switchBlock}
              isOn={dmEmail === "1" ? true : false}
              onToggle={(val) => {
                setDmEmail(val);
                changPersonlMessage();
                return dispatch(
                  personalMessageRequest({
                    token: token,
                    name: val ? "1" : "0",
                  })
                );
              }}
            />
            <BlockWithSwitchButton
              title={"Push-уведомления"}
              titleStyle={styles.smallSwitchTitle}
              style={styles.switchBlock}
              isOn={dmPush === "1" ? true : false}
              onToggle={(val) => {
                setDmPush(val);
                changPersonlNotify();
                return dispatch(
                  personalNotificationRequest({
                    token: token,
                    name: val ? "1" : "0",
                  })
                );
              }}
            />
          </View>
          <View style={styles.notificationsSection}>
            <BlockWithSwitchButton
              title={"Общие чаты"}
              titleStyle={styles.bigSwitchTitle}
              style={[styles.switchBlock, styles.bigSwitch]}
              isButton={false}
              description={
                "Создание новых общих чатов и добавление новых комментариев"
              }
            />
            <BlockWithSwitchButton
              title={"Электронная почта"}
              titleStyle={styles.smallSwitchTitle}
              style={styles.switchBlock}
              isOn={groupMessagesEmail === "1" ? true : false}
              onToggle={(val) => {
                changGlobalMessage();
                setGroupMessagesEmail(val);
                return dispatch(
                  globallMessageRequest({ token: token, name: val ? "1" : "0" })
                );
              }}
            />
            <BlockWithSwitchButton
              title={"Push-уведомления"}
              titleStyle={styles.smallSwitchTitle}
              style={styles.switchBlock}
              isOn={groupMessagesPush === "1" ? true : false}
              onToggle={(val) => {
                changGlobalNotifuy();
                setGroupMessagesPush(val);
                return dispatch(
                  globallNotificationRequest({
                    token: token,
                    name: val ? "1" : "0",
                  })
                );
              }}
            />
          </View>
          <View style={styles.notificationsSection}>
            <BlockWithSwitchButton
              title={"Новые предложения"}
              titleStyle={styles.bigSwitchTitle}
              style={[styles.switchBlock, styles.bigSwitch]}
              isButton={false}
              description={
                "Добавление новых запросов и предложений от пользователей в раздел «Все предложения»"
              }
            />
            <BlockWithSwitchButton
              title={"Электронная почта"}
              titleStyle={styles.smallSwitchTitle}
              style={styles.switchBlock}
              isOn={newMessagesEmail === "0" ? true : false}
              onToggle={(val) => {
                changOfferMessage();
                setNewMessagesEmail(val ? !val : val);
                return dispatch(
                  offerMessageRequest({ token: token, name: val ? "1" : "0" })
                );
              }}
            />
            <BlockWithSwitchButton
              title={"Push-уведомления"}
              titleStyle={styles.smallSwitchTitle}
              style={styles.switchBlock}
              isOn={newMessagesPush === "1" ? true : false}
              onToggle={(val) => {
                changOfferNotify();
                setNewMessagesPush(val);
                return dispatch(
                  offerlNotificationRequest({
                    token: token,
                    name: val ? "1" : "0",
                  })
                );
              }}
            />
          </View>
        </AccordionItem>
        <AccordionItem
          headerStyle={styles.headerStyle}
          arrowStyle={styles.arrowStyle}
          titleComponent={
            <Text style={styles.header}>Действия с профилем</Text>
          }
          childrenStyle={styles.block}
        >
          <BlockWithSwitchButton
            title={"Скрыть профиль"}
            titleStyle={styles.bigSwitchTitle}
            style={[styles.switchBlock, styles.bigSwitch]}
            description={
              "Другие участники не видят вашу персональную информацию, но видят информацию о вашей компании"
            }
            isOn={hideProfile === "1" ? true : false}
            onToggle={(val) => {
              setHideProfile(val);
              changeHide();
              return dispatch(
                hideUserRequest({ token: token, hideNumber: val ? 1 : 0 })
              );
            }}
          />
          <BlockWithSwitchButton
            title={"Удалить профиль"}
            titleStyle={styles.bigSwitchTitle}
            r
            style={[styles.switchBlock, styles.bigSwitch]}
            description={
              "Удаление данных о вашем личном профиле, но не о компании"
            }
            isOn={deleteProfile}
            onToggle={() => {
              dispatch(deleteUserRequest({ token: token }));
              setDeleteProfile(!deleteProfile);
              return Updates.reloadAsync();
            }}
          />
        </AccordionItem>
      </View>
      <LogOutModal
        onSubmit={() => {
          dispatch(logout());
          return Updates.reloadAsync();
        }}
        deleted
        onCancel={() => setDeleteProfile(false)}
        isVisible={deleteProfile}
      />
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: WRAPPER_PADDINGS,
  },
  imageBlock: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 26,
  },
  imageView: {
    width: 100,
    height: 100,
    marginRight: 40,
  },
  qrView: {
    padding: 3,
    backgroundColor: "#000",
    borderRadius: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  smallButton: {
    color: COLOR_1,
    marginLeft: -16,
  },
  notificationsSection: {
    marginBottom: 20,
  },
  switchBlock: {
    marginBottom: 20,
    marginTop: -10,
  },
  smallSwitchTitle: {
    fontSize: 10,
    fontFamily: "GothamProMedium",
    color: COLOR_1,
  },
  bigSwitch: {
    marginBottom: 30,
  },
  bigSwitchTitle: {
    fontSize: 12,
    fontFamily: "GothamProMedium",
    color: COLOR_1,
  },
  nonEditableInput: {
    backgroundColor: COLOR_6,
  },
  header: {
    fontSize: 12,
    fontFamily: "GothamProMedium",
    color: COLOR_1,
  },
  headerStyle: {
    paddingVertical: 18,
  },
  arrowStyle: {
    top: 20,
  },
  block: {},
  dropDown: {
    borderWidth: 1.5,
    fontSize: 14,
    borderRadius: 9,
    borderColor: "#EEEEEE",
    height: 46,
    fontFamily: "GothamProLight",
    marginBottom: 16,
    marginTop: -16,
    lineHeight: 13,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEEEEE",
  },
  dropDownCountrys: {
    borderWidth: 1.5,
    fontSize: 14,
    borderRadius: 9,
    borderColor: "#EEEEEE",
    fontFamily: "GothamProLight",
    marginBottom: 16,
    backgroundColor: "#EEEEEE",
    paddingHorizontal: 8,
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
  selectText: {
    marginTop: 10,
    zIndex: 9999,
    height: 20,
  },
  selectArrowStyle: {
    top: 16,
  },
  dropDownCitys: {
    borderWidth: 2,
    borderColor: COLOR_6,
    borderRadius: 6,
    paddingLeft: 10,
  },
  sectionSelect: {
    width: "100%",
    height: 46,
    backgroundColor: COLOR_6,
    borderRadius: 9,
    marginBottom: 20,
  },
  no_product: {
    textAlign: "center",
    marginTop: 50,
  },
});

export default MyProfile;
