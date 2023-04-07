import React, { useEffect, useState } from "react";
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { COLOR_1, COLOR_6, COLOR_9 } from "../helpers/Variables";
import { ImageSeePassword, ImageUnSeePassword } from "../helpers/images";
import { AntDesign } from "@expo/vector-icons";

function MyInput({
  label,
  phoneNumber,
  style,
  labelStyle,
  error,
  onEyePressed,
  showEye,
  sendComponent,
  keyboardType,
  filtered,
  resetText,
  textarea,
  numberTel,
  isGray,
  placeholder,
  secureTextEntry,
  ...p
}) {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     isActive: false,
  //   };
  // }
  const [isActive, setIsActive] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      {/* {numberTel && (
          <Text style={styles.faceNumberTel}>
            {!phoneNumber?.length && isActive && "+7("}
            {phoneNumber?.length > 2 && "+7("}
            {phoneNumber?.length === 2 && isActive && "+7"}
            {!phoneNumber.replace(regex)}
          </Text>
        )} */}
      {/* {phoneNumber?.length > 5 && <Text style={styles.fake}>{")"}</Text>} */}
      <TextInput
        {...p}
        maxLength={numberTel ? 10 : 100000}
        keyboardType={keyboardType}
        placeholderTextColor={"black"}
        secureTextEntry={secureTextEntry}
        placeholder={
          !isActive && !phoneNumber && numberTel
            ? phoneNumber
            : !numberTel
            ? placeholder
            : ""
        }
        style={[
          styles.input,
          { borderColor: isActive && !textarea ? COLOR_9 : COLOR_6 },
          showEye && { paddingRight: 50 },
          style,
          textarea && [styles.input, { height: 125, verticalAlign: "top" }],
          isGray && [styles.input, { backgroundColor: "#EEEEEE" }],
          numberTel && [styles.input, { letterSpacing: 2 }],
        ]}
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
      />
      {filtered && (
        <TouchableOpacity onPress={resetText} style={styles.cancelIcon}>
          <AntDesign name="closecircle" size={20} color="black" />
        </TouchableOpacity>
      )}
      {showEye ? (
        <TouchableOpacity
          style={styles.seeUnseeView}
          onPress={() => onEyePressed(secureTextEntry)}
        >
          {!secureTextEntry ? (
            <ImageSeePassword style={styles.see} />
          ) : (
            <ImageUnSeePassword style={styles.unsee} />
          )}
        </TouchableOpacity>
      ) : null}
      {sendComponent && sendComponent}
      {error && error[0] ? <Text style={styles.error}>{error[0]}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 2,
    fontSize: 14,
    borderRadius: 8,
    color: "#000",
    paddingHorizontal: 15,
    height: 46,
    paddingTop: 14,
    paddingBottom: 12,
    fontFamily: "GothamProLight",
    lineHeight: 13,
  },
  label: {
    fontSize: 10,
    color: COLOR_1,
    fontFamily: "GothamProMedium",
    marginLeft: 10,
    marginBottom: 6,
  },
  error: {
    color: "red",
    fontSize: 12,
  },
  seeUnseeView: {
    position: "absolute",
    right: "4%",
    top: 32,
  },
  unsee: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  see: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    marginTop: 2,
  },
  cancelIcon: {
    position: "absolute",
    right: 10,
    top: 34,
  },
  faceNumberTel: {
    position: "absolute",
    left: 16,
    fontFamily: "GothamProLight",
    top: 33,
  },
  fake: {
    position: "absolute",
    left: 64,
    top: 30,
  },
});

export default MyInput;
