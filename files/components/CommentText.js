import React from 'react';
import {StyleSheet, 
        Text, 
        View, 
        Dimensions, 
        Image, 
        TouchableOpacity, 
        } from 'react-native';

import Color from '../constants/Color';
import Icon from 'react-native-vector-icons/FontAwesome';

const WIDTH = Dimensions.get('window').width;

const CommentText = (props) => {

return(
<View style={styles.screen}>

    <View style={styles.userTitleInfo} >

        <TouchableOpacity onPress={props.onProfileImg} style={styles.btnImgUser} >
            <Image style={{width: 50, height: 50, borderRadius: 25}} 
            source={props.UserProfile} />
        </TouchableOpacity>

<View style={styles.textBoxCmnt}>

        <TouchableOpacity onPress={props.onTitleName}>
            <Text style={{fontSize: 15,fontWeight: 'bold', color: 'white', paddingLeft: 7, paddingTop: 5}}>
                {props.commentTitleName}
            </Text>
        </TouchableOpacity>

        <View style={{paddingHorizontal: 5}}>
            <Text style={{color: 'white'}}>{props.comment}</Text>
        </View>

<View style={styles.reactBottomBar} >

    <View style={styles.reactionCont}>

        <TouchableOpacity onPress={props.onLikePress}>
            <Icon size={20} color='white' name='arrow-up'/>
        </TouchableOpacity>
        <Text style={{padding: 5, color:'white'}}>{props.upvotesCount}</Text>

    </View>


    <View style={styles.reactionCont}>

    <TouchableOpacity onPress={props.onDisLikePrss}>
        <Icon size={20} color= 'white' name='arrow-down'/>
    </TouchableOpacity>
    <Text style={{padding: 5, color: 'white'}}>{props.downvotesCount}</Text>

    </View>

    <View style={styles.reactionCont}>

    <TouchableOpacity onPress={props.onReplyComment}>
        <Icon size={20} color= 'white' name='comment'/>
    </TouchableOpacity>
    <Text style={{padding: 5, color: 'white'}}>{props.totalCommentCount}</Text>

    </View>

    <View style={styles.reactionCont}>

    <TouchableOpacity onPress={props.onReplyPress}>
        <Text style={{color: 'white', fontSize: 18}}>reply</Text>
    </TouchableOpacity>

    </View>

  </View>

  </View>
</View>

</View>
);
}

const styles = StyleSheet.create({
screen :{
    
},
userTitleInfo :{
    flexDirection: 'row',
    width: WIDTH,
    padding: 5,
},
reactBottomBar :{
    margin: 0,
    padding: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 10,
    height: 40,
},
reactionCont :{
    flexDirection: 'row',
    paddingRight: 5,
},
textBoxCmnt :{
    width: WIDTH * 0.83,
    padding: 2,
    borderColor: Color.accent,
    borderWidth: 1,
    borderRadius: 10,
    marginLeft: 5,
}
});

export default CommentText;