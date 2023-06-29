import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { COLOR_6 } from "../helpers/Variables";
import { ImageArrowDown, ImageArrowUp } from "../helpers/images";

export default AccordionItem = ({
  children,
  isopenModal,
  titleComponent,
  onPress,
  arrowComponent,
  wrapperStyle,
  headerStyle,
  arrowStyle,
  expanded,
  type = false,
  childrenStyle,
}) => {
  const [expand, setExpandedNew] = useState(expanded || false);

  const setExpanded = (val) => setExpandedNew(val);

  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      <TouchableOpacity
        style={[!expanded || (expand && styles.headerBorder), headerStyle]}
        onPress={
          typeof isopenModal === "function"
            ? isopenModal
            : () => {
                // alert(typeof onPress)
                setExpanded(!expand);
                isopenModal && isopenModal();
              }
        }
        // onPress={isopenModal}
        activeOpacity={0.5}
      >
        {titleComponent}
        <View style={[styles.arrowView, arrowStyle]}>
          {arrowComponent ? (
            arrowComponent
          ) : expanded || expand ? (
            <ImageArrowUp />
          ) : (
            <ImageArrowDown />
          )}
        </View>
      </TouchableOpacity>
      {type
        ? expanded && (
            <View style={[styles.children, childrenStyle]}>{children}</View>
          )
        : expand && (
            <View style={[styles.children, childrenStyle]}>{children}</View>
          )}
      {/* {expanded && (
        <View style={[styles.children, childrenStyle]}>{children}</View>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    // overflow: "hidden",
  },
  headerBorder: {
    borderBottomWidth: 0,
    borderBottomColor: COLOR_6,
  },
  arrowView: {
    position: "absolute",
    right: 8,
  },
  children: {
    // marginBottom: 50,
    // position: "absolute",
    // width: "100%",
    // height: "100%",
    // zIndex: 1,
  },
});
