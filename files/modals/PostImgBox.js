import React from 'react';
import {View, Image, Dimensions, TouchableOpacity, StyleSheet} from 'react-native';


// const WIDTH = Dimensions.get('window');

const {height, width} = Dimensions.get('window');

const PostImgBox = props => {

   

return(
 <View style={{...styles.imgCont, ...props.style}} >

    <TouchableOpacity activeOpacity={0.6} style={{flex: 1}} activeOpacity={0.8} onPress={props.onPress}>
       <Image resizeMode="stretch" style={styles.imgStyle} source={props.source}/>
    </TouchableOpacity>

 </View>
);
}

const styles = StyleSheet.create({
imgCont :{
padding: 1,
alignItems: 'center'
},
imgStyle :{
    flex: 1,
   //  width: WIDTH <= 350 ? 320 : (WIDTH <= 370 ? 360 : 400),
   //  height: WIDTH <= 350 ? 300 : (WIDTH <= 370 ? 340 : 400),
   // height:  (height<width) ? width : height,
   width: (width>height) ? height : width,
   height: width < 370 ? 360 : 400 ,
}
});

export default PostImgBox;