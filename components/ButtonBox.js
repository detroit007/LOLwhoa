import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import Color from '../constants/Color';

const ButtonBox = props => {

return(
      <TouchableOpacity
        style={{...styles.btnCont, ...props.style}}
        onPress={props.onPress}
        activeOpacity={0.6}
      >
        <Text style={styles.txtStyle}>
          {props.children}
        </Text>

      </TouchableOpacity>
);
}

const styles = StyleSheet.create({
btnCont :{
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 4,
},
txtStyle :{
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
}
});

export default ButtonBox;