import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TextInput,
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

function EditApplication(props) {
  const { route, navigation } = props;
  const { currentPage, item, user, token } = route.params;
  const [citys, setCitys] = useState();
  const [fromCityName, setFromCityName] = useState();
  const [toCityName, setToCityName] = useState();
  const [openCitys, setOpenCitys] = useState(false);
  const [openCitysFrom, setOpenCitysFrom] = useState(false);
  const [containerCount, setContainerCount] = useState("");
  const [price, setPrice] = useState();
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [from_city, setFrom_city] = useState();
  const [to_city, setTo_city] = useState();
  const [searchValue, setSearchValue] = useState("");
  const { loading } = useSelector((state) => state.editAplicationsSlice);
  let allCitys = useSelector(
    (state) => state.getCitysSlice?.data?.data?.data?.citys
  );
  const dispatch = useDispatch();

  const filtered = (searchText) => {
    setCitys(
      allCitys?.filter((c) => {
        return c?.title?.ru?.includes(searchText);
      })
    );
  };

  useEffect(() => {
    route.params.activeTab !== "В работе" && setSaveAsDraft(true);
  }, [route]);
  const save = () => {
    dispatch(
      editAplicationsRequest({
        secret_token: token,
        last_id: item.last_id + "",
        from_city: from_city ? from_city : item.from_city.last_id,
        to_city: to_city ? to_city : item.to_city.last_id,
        count: containerCount ? containerCount + "" : item?.count + "",
        price: price ? price : item?.price,
        responsible: user?.last_id + "",
        _type_op: saveAsDraft ? "draft" : "onwork",
      })
    )
      .unwrap()
      .then((res) => {
        navigation.goBack();
      })
      .catch((e) => {
        showMessage({
          type: "danger",
          message: "Некорректные данные",
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

  const openCitysModal = () => {
    setOpenCitys(!openCitys);
  };
  const openCytysFromModal = () => {
    setOpenCitysFrom(!openCitysFrom);
  };

  useEffect(() => {
    searchValue && filtered(searchValue);
  }, [searchValue]);
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
      <View style={styles.wrapper}>
        <AccordionItem
          titleComponent={
            <Text style={styles.selectText}>
              {fromCityName
                ? fromCityName
                : item?.from_city?.title?.ru || "Откуда"}
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
              {toCityName ? toCityName : item?.to_city?.title?.ru || "Куда"}
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
        <MyInput
          label={"Количество контейнеров"}
          value={containerCount}
          placeholder={item?.count + ""}
          onChangeText={(val) => setContainerCount(val)}
          keyboardType={"numeric"}
        />
        <MyInput
          label={"Ставка"}
          value={price}
          placeholder={item?.price + ""}
          onChangeText={(val) => setPrice(val)}
          keyboardType={"numeric"}
        />
        <BlockWithSwitchButton
          title={"Сохранить как черновик"}
          titleStyle={styles.selectText}
          onToggle={(val) => setSaveAsDraft(val)}
          isOn={saveAsDraft}
        />
        {loading && (
          <Modal backdropOpacity={0.75} isVisible={true}>
            <View>
              <ActivityIndicator size="large" />
            </View>
          </Modal>
        )}
      </View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: WRAPPER_PADDINGS,
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
});

export default EditApplication;
