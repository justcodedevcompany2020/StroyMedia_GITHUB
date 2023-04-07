import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, TextInput } from "react-native";
import { View, TouchableOpacity, Text } from "react-native";
import { ImageArrowSmall, ImageArrowSmallUp } from "../helpers/images";
import Modal from "react-native-modal";
import { COLOR_1, COLOR_5 } from "../helpers/Variables";
import { AntDesign } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import DelayInput from "react-native-debounce-input";

function FilterItem(props) {
  const [expanded, setExpanded] = useState("");
  const { title, onSelect, options, top } = props;
  const [searchValue, setSearchValue] = useState("");
  const [citys, setCitys] = useState([]);
  let allCitys = useSelector(
    (state) => state.getCitysSlice?.data?.data?.data?.citys
  );
  const renderItem = ({ item }) => {
    if (item?.title?.ru) {
      item = item.title.ru;
    } else if (item?.title) {
      item = item?.title;
    } else if (item) {
      item = item;
    }

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          // return false;
          setExpanded(false);
          onSelect(item);
        }}
        style={styles.optionBlock}
      >
        <Text style={styles.option}>{item}</Text>
      </TouchableOpacity>
    );
  };
  useEffect(() => {
    setCitys(options);
  }, [expanded]);

  const filtered = (searchText) => {
    setCitys(
      allCitys?.filter((c) => {
        return c?.title?.ru?.includes(searchText);
      })
    );
  };

  useEffect(() => {
    filtered(searchValue);
  }, [searchValue]);

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.3}
        onPress={() => setExpanded(!expanded)}
        style={styles.wrapper}
      >
        <Text style={styles.title}>{title}</Text>
        {expanded ? <ImageArrowSmallUp /> : <ImageArrowSmall />}
      </TouchableOpacity>
      <Modal
        isVisible={expanded ? true : false}
        transparent={true}
        animationIn={"fadeInDown"}
        animationOut={"fadeOutUp"}
        onRequestClose={() => setExpanded(false)}
        hardwareAccelerated={true}
        style={styles.modal}
        onBackdropPress={() => setExpanded(false)}
        backdropOpacity={0}
        animationInTiming={100}
        animationOutTiming={100}
        deviceHeight={350}
      >
        <View style={[styles.showPart, props?.offers && { top: 20 }]}>
          {props?.isCitys && (
            <View style={styles.searchRow}>
              <DelayInput
                placeholder="Search"
                value={searchValue}
                minLength={1}
                onChangeText={(text) => setSearchValue(text)}
                delayTimeout={500}
                style={styles.searchInput}
              />
            </View>
          )}
          {!citys?.length && <Text style={styles.no_product}>Не найдено</Text>}

          <FlatList
            data={citys?.length ? citys : []}
            renderItem={renderItem}
            key={(item, index) => index.toString()}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 25,
  },
  modal: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  searchRow: {
    flexDirection: "row",
  },
  citysSearch: {
    flexDirection: "row",
    alignItems: "center",
    alignItems: "center",
  },
  searchInput: {
    borderWidth: 0.5,
    borderColor: COLOR_1,
    borderRadius: 5,
    height: 30,
    marginBottom: 8,
    padding: 5,
    marginRight: 8,
    flex: 1,
  },
  selectText: {
    marginTop: 10,
    zIndex: 9999,
    height: 20,
  },
  title: {
    color: COLOR_1,
    fontFamily: "GothamProMedium",
    fontSize: 14,
    marginRight: 10,
    fontWeight: "800",
  },
  showPart: {
    // position: "absolute",
    backgroundColor: COLOR_5,
    height: 200,
    paddingHorizontal: 8,
    paddingVertical: 20,
    width: "100%",
    left: 6,
    zIndex: 2,
    borderWidth: 1,
    borderColor: COLOR_1,
    borderRadius: 10,
  },
  optionBlock: {
    marginBottom: 18,
  },
  option: {
    color: COLOR_1,
    fontFamily: "GothamProMedium",
    fontSize: 12,
  },
  no_product: {
    textAlign: "center",
    marginTop: 50,
  },
});

export default FilterItem;
