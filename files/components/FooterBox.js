import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const FooterBox = props => {
return(
  <View style={{...styles.footerCont, ...props.style}} >
     <Text style={{color: 'white', textAlign: 'center'}}> veteranlogix {'\u00A9'} 2019. all rights reserved.</Text>
  </View>
);
}

const styles = StyleSheet.create({
footerCont :{
    backgroundColor: 'black',
    padding: 5
}
});

export default FooterBox;