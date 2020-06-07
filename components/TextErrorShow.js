import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions
} from 'react-native';

// const WIDTH = Dimensions.get('window').width;
const TextErrorShow = (props)=> {
    return(
        <View style={styles.container}>
            <Text style={{ color: 'red'}}>{props.text}</Text> 
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: -5,
    }
});

export default TextErrorShow;