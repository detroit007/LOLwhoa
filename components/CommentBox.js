import React, {useState} from 'react';
import {StyleSheet, 
        Text, 
        View, 
        Dimensions, 
        TextInput,
        Image, 
        TouchableOpacity } from 'react-native';

import Color from '../constants/Color';

const WIDTH = Dimensions.get('window').width;
const CommentBox = props => {

    const [commentValue, setCommentValue] = useState('');
    const onCommentChangeHandler = val => {
        setCommentValue(val);
    }
return(
    <View style={{...styles.screen, ...props.style}}>
        <View style={styles.userTitleInfo} >
            {/* <TouchableOpacity onPress={()=>{}} style={{justifyContent: 'center'}} >
                <Image style={{width: 50, height: 50, borderRadius: 25}} 
                source={props.UserProfile} />
            </TouchableOpacity> */}

            <View style={{paddingLeft: 5}}>
                <TextInput
                  multiline
                  numberOfLines={4}
                  style={styles.textComment}
                  onChangeText={props.onCommentChange}
                  value={props.cmntValue}
                  placeholder='comment'
                  placeholderTextColor = {Color.placeholderColor}
                />
            </View>
            <TouchableOpacity onPress={props.onSubmit} style={styles.btnCmntStyle}>
                <Text style={{color: 'white'}}>Submit</Text>
            </TouchableOpacity>
        </View>
   
  </View>
)
}

const styles = StyleSheet.create({
screen :{
    
},
userTitleInfo :{
    flexDirection: 'row',
    width: '100%',
    height: 60,
},
textComment :{
    backgroundColor: Color.accent,
    width: WIDTH * 0.798,
    paddingLeft: 10,
    height: 60,
    borderRadius: 6,
    color: 'white',
    fontSize: 16
},
reactionCont :{
    flexDirection: 'row',
    paddingRight: 10
},
btnCmntStyle :{
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: 'black',
    height: 60,
    padding: 10,
    marginLeft: 5,
}
});

export default CommentBox;