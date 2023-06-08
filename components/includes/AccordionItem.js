import React, {useState} from "react";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {COLOR_6} from "../helpers/Variables";
import {ImageArrowDown, ImageArrowUp} from "../helpers/images";

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
                                  childrenStyle,
                                }) => {
  const [expand, setExpandedNew] = useState(expanded || false);

  const setExpanded = (val) => setExpandedNew(val);

  return (<View style={[styles.wrapper, wrapperStyle]}>
    <TouchableOpacity
      style={[styles.header, !expand && styles.headerBorder, headerStyle]}
      onPress={typeof onPress === "function" ? onPress : () => {
        setExpanded(!expand);
        isopenModal && isopenModal();
      }}
      activeOpacity={0.5}
    >
      {titleComponent}
      <View style={[styles.arrowView, arrowStyle]}>
        {arrowComponent ? (arrowComponent) : expand ? (<ImageArrowUp/>) : (<ImageArrowDown/>)}
      </View>
    </TouchableOpacity>
    {expand && (<View style={[styles.children, childrenStyle]}>{children}</View>)}
  </View>);
};

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  }, header: {}, headerBorder: {
    borderBottomWidth: 0, borderBottomColor: COLOR_6,
  }, arrowView: {
    position: "absolute", right: 8,
  }, children: {
    marginTop: 20,
  },
});
