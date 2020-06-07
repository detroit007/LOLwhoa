import React, { useState } from 'react';
import {View,Image, Text, StyleSheet, TouchableOpacity} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Color from '../constants/Color';

import PostImgBox from '../modals/PostImgBox';
import AsyncStorage from '@react-native-community/async-storage';


const PostBox = props=> {

    const [accessToken, setAccessToken] = useState('');

const getData = async()=>{
let value = await AsyncStorage.getItem('access_token');
if(value != null){
    setAccessToken(value);
}
}

return(
<View style={styles.screen} >
   <View style={styles.userContainer} >
    <View style={styles.userInfoCont} >

      <View style={styles.userInfoAndView} >

          <View style={styles.userDetail}>

            <View style={styles.userTitleInfo} >
                <TouchableOpacity activeOpacity={0.6} onPress={props.onPressProfile} style={styles.btnImgUser} >
                   <Image style={{width: 60, height: 60}} source={props.source} />
                </TouchableOpacity>

                <View style={{paddingLeft: 5}}>
                   <TouchableOpacity activeOpacity={0.6} onPress={props.titleOnPress}>
                      <Text style={{color: 'white', width: '95%'}} >{props.title}</Text>
                   </TouchableOpacity>
                   <Text style={{color: 'white',}}>{props.name} - {props.created_at}</Text>
                </View>
            </View>
            <View style={styles.postViewsInfo} >
                <Icon name='eye' style={{paddingTop: 5}} color='white'/>
                <Text style={{color: 'white'}} > views {props.view_count} </Text>
            </View>

          </View>
      </View>
      <View style={styles.userTagInfo} >
          <Icon name='tag'style={{paddingTop: 5}} color='white'/>

          <TouchableOpacity activeOpacity={0.6} onPress={()=>{}}>
              <Text style={{color: 'white'}}> {props.tags} </Text>
          </TouchableOpacity>
      </View>
    </View>
  </View>

  <PostImgBox onPress={props.postImgOnPress} source={props.sourceThumb}/>

  <View style={styles.reactBottomBar} >

     <View style={styles.reactionCont}>

        <TouchableOpacity activeOpacity={0.6} onPress={props.upvote}>
           <Icon size={25} color='white' name='thumbs-up'/>
        </TouchableOpacity>
        <Text style={{padding: 5, color:'white'}}>{props.upvotesCount}</Text>

     </View>

     <View style={styles.reactionCont}>

        <TouchableOpacity activeOpacity={0.6} onPress={props.downvote}>
           <Icon size={25} color= 'white' name='thumbs-down'/>
        </TouchableOpacity>
        <Text style={{padding: 5, color: 'white'}}>{props.downvotesCount}</Text>

     </View>

     <View style={styles.reactionCont}>

        <TouchableOpacity activeOpacity={0.6} onPress={props.onPostComment}>
           <Icon size={25} color= 'white' name='comment'/>
        </TouchableOpacity>
        <Text style={{padding: 5, color: 'white'}}>{props.totalComments}</Text>

     </View>

     <View style={styles.reactionCont}>

        <TouchableOpacity activeOpacity={0.6} onPress={props.share}>
           <Icon size={25} color= 'white' name='share'/>
        </TouchableOpacity>
        <Text style={{padding: 5, color: 'white'}}>{props.share_count}</Text>

     </View>
  </View>


</View>
);
}

const styles= StyleSheet.create({
screen :{
    flex: 1,
    marginBottom: 10,
},
userContainer :{
    backgroundColor: Color.accent
},
userDetail :{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
},
userTitleInfo :{
    flexDirection: 'row',
    width: '70%',
    alignItems: 'center'
},
btnImgUser :{
    borderRadius: 30,
    overflow: 'hidden',
    margin: 5
},
postViewsInfo :{
    flexDirection: 'row',
    padding: 5,
    backgroundColor: 'black',
    height: 30,
    marginRight: 10,
    borderRadius: 6,
},
userTagInfo :{
    flexDirection : 'row',
    paddingBottom: 5,
    paddingLeft: 10
},
reactBottomBar :{
    flexDirection: 'row',
    paddingLeft: 15,
    backgroundColor: Color.accent,
    paddingVertical: 5
},
reactionCont :{
    flexDirection: 'row',
    paddingRight: 10
}

});

export default PostBox;