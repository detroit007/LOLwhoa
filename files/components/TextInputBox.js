import React from 'react';
import {View, TextInput,Dimensions, StyleSheet} from 'react-native';

import Color from '../constants/Color';

const TextInputBox = props =>{

return(
  <View style={styles.txtBoxCont}>
    <TextInput
      {...props}
      autoCorrect={false}
      autoComplete={false}
      placeholderTextColor= {Color.placeholderColor}
      style={{...styles.txtBoxStyle, ...props.style}}
    />
  </View>
);
}

const styles = StyleSheet.create({
txtBoxStyle :{
    backgroundColor: Color.accent,
    color: Color.primaryColor,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    width: Dimensions.get('window').width * 0.89,
    height: 50,
    borderRadius: 4,
    color: 'white',
    marginVertical: 10,
    fontSize: 16
}
});

export default TextInputBox;