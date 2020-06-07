import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
  Text,
} from 'react-native';

import NavigationScreen from './navigation/NavigationScreen'
const App: () => React$Node = () => {

console.disableYellowBox = true;

return (
  <View style={styles.screen}>
    <NavigationScreen/>
  </View>
);
};

const styles = StyleSheet.create({
screen :{
  flex: 1,
}
});

export default App;
