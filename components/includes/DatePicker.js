import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import MyInput from "./MyInput";
import { ImageCalendarSmall } from "../helpers/images";
import moment from "moment";

function MyDatePicker(props) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const {date, setDate, body } = props;
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => setShowDatePicker(true)}
    >
      <MyInput
        label={body ? body : "Дата погрузки"}
        disabled
        style={styles.input}
        editable={false}
        value={moment(date).format("DD.MM.YY")}
      />
      <ImageCalendarSmall style={styles.calendar} />
      {showDatePicker && (
        <RNDateTimePicker
          value={date}
          onChange={(event, date) => {
            setShowDatePicker(false);
            setDate(event, date);
          }}
          minimumDate={new Date()}
          mode={"date"}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  input: {
    paddingLeft: 40,
  },
  calendar: {
    position: "absolute",
    left: 14,
    top: 34,
  },
});

export default MyDatePicker;
