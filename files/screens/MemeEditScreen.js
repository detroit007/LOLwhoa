import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const MemeEditScreen = props=> {
return(
<View style={styles.screen} >
    <Text>I am MemeEdit Screen</Text>
</View>
);
}

const styles= StyleSheet.create({
screen :{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
}
});

export default MemeEditScreen;