import React, {useState, useEffect, useCallback} from 'react';
import {Modal, Alert, View, ActivityIndicator, StyleSheet, FlatList} from 'react-native';
import CommentBox from '../../components/CommentBox';
import CommentText from '../../components/CommentText';
import Color from '../../constants/Color';
import AsyncStorage from '@react-native-community/async-storage';
import ApiConfig from '../../server/ApiConfig';
import ReplyModal from '../subScreens/ReplyModal';


const CommentModal = props => {

    const [commentCountFlag, setCommentCountFlag] = useState(false);

    const [commentData, setCommentData] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [modalLoad, setModalLoad] = useState(false);

    const [upCount, setUpCount] = useState(false);
    const [downCount, setDownCount] = useState(false);
    
    const [Slug, setSlug] = useState('');

    const [accessToken, setAccessToken] = useState(''); 
    const [memeId, setMemeId] = useState('');

    const [commentValue, setCommentValue] = useState('');
    const onCommentChangeHandler = val => {
        setCommentValue(val);
    }

    const getData = async () => {
      let value = await AsyncStorage.getItem('access_token');
          let slug = await AsyncStorage.getItem('slug');
          let uuid = await AsyncStorage.getItem('uuid');
          if(slug != null){
            setSlug(slug);
          }
          if(value !== null) {
            setAccessToken(value);
        }
        if(slug != null && uuid != null){
        fetch(`https://lolwhoa.com/api/${slug}/${uuid}`)
        .then(res => res.json())
        .then(data => {
          if(data.memes.comments){
            setCommentData(data.memes.comments)
            setLoading(false);
            setMemeId(data.memes.id);
          }else{
            Alert.alert(
              'LolWhoa Says',
              'Something went wrong..', [{
                  style: 'cancel'
              }, {
                  text: 'OK',
              }, ], {
                  cancelable: false
              }
           )
          }
    }
        ).catch((err)=> {
          //
        })
      }   
}

  const postLikeHandler = (id)=>{

    fetch(ApiConfig.LIKE_COMMENT_URL,{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type' : 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        value: 1,
        comment_id: id,
      })
    }).then(res=> res.json()).
      then(data=>{
        if(data.status){
          setUpCount(!upCount);
        }
      }).
      catch(err=>{
        //
      })
  }

  const postDisLikeHandler = (id)=>{

    fetch(ApiConfig.LIKE_COMMENT_URL,{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type' : 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        value: 0,
        comment_id: id,
      })
    }).then(res=> res.json()).
      then(data=>{
        if(data.status){
          setDownCount(!downCount);
        }
      }).
      catch(err=>{
        //
      })
  }

const getSlug = async() => {
  let val = await AsyncStorage.getItem('slug');
  if(val != null){
    setSlug(val);
  }
}
getSlug();


useEffect(()=>{
  getData();
},[Slug, commentValue, upCount, downCount, commentCountFlag]);

const sendCommentToServer = ()=>{
  getData();
  if(!commentValue){
    Alert.alert('Enter Something First')
  }else{
  fetch(ApiConfig.COMMENT_ON_POST_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      comment_body: commentValue,
      meme_id: memeId,
    })
  })
  .then(res => res.json())
  .then(data => { 
    setCommentValue('');
    setCommentCountFlag(!commentCountFlag);
}).catch(e=>{
  //
});
}}

const onRandomPersonProfile = async(name, id)=>{
  const userId = id.toString();
  if(name != null && userId != null){
  await AsyncStorage.setItem('userName', name);
  await AsyncStorage.setItem('userId', userId);
  props.navigation.navigate('Profile');
  }
}

const renderData = itemData => {
    return(
      <CommentText 
        commentTitleName={itemData.item.user.name}
        UserProfile={itemData.item.UserAvatar != null ?
                {uri: `${ApiConfig.PROFILE_URL}${itemData.item.UserAvatar}`}
            : require('../../assets/img/default_male.png')}
        onProfileImg={()=>{
        onRandomPersonProfile(itemData.item.user.name, itemData.item.user.id)
        }}
        onTitleName={()=>{
        onRandomPersonProfile(itemData.item.user.name, itemData.item.user.id)
        }}
        comment={itemData.item.body}
        upvotesCount={ itemData.item.upvotes}
        downvotesCount={ itemData.item.downvotes}
        totalCommentCount={ itemData.item.repliesCount}
        onLikePress={()=>postLikeHandler(itemData.item.id)}
        onDisLikePrss={()=>postDisLikeHandler(itemData.item.id)}
        onReplyPress={()=>onCancelHandler(itemData.item.id, itemData.item.meme_id, commentData.findIndex(x => x.body === itemData.item.body))}
      />
    )
}

    const setData = async (commentId, memeId, commentIndex) => {
        if(commentId != null && memeId != null){
        await AsyncStorage.setItem('commentId', commentId);
        await AsyncStorage.setItem('memeId', memeId);
        if(commentIndex != null){
          await AsyncStorage.setItem('commentIndex', commentIndex);
        }
    }
  }

const onCancelHandler = (id, Memeid, CommentIndex) =>{
  let commentId = id.toString();
  let MemeId = parseInt(Memeid);
  let index = parseInt(CommentIndex)
  setModalLoad(!modalLoad);
  setData(commentId, MemeId.toString(), index.toString());
}



return(
  <View style={styles.screen}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={props.modalVisible}
        onRequestClose={props.onCancel}
      >
      
      { isLoading == true ? 
        <View style={{flex: 1,backgroundColor: Color.primaryColor, justifyContent: 'center'}} >
        <ActivityIndicator color='white' size='large' />
          </View> 
          : <View style={styles.container}>
          <FlatList
              data={commentData}
              renderItem={renderData}
              keyExtractor={(key, index)=>  index.toString()}
          />
           </View>
    }

<ReplyModal
  modalVisible={modalLoad}
  onCancel={onCancelHandler}
/>
    
     <CommentBox style={styles.cmntBox}
       onCommentChange={onCommentChangeHandler}
       cmntValue={commentValue}
       onSubmit={()=>{sendCommentToServer()}}
     />
      </Modal>    
  </View>
);
}

const styles = StyleSheet.create({
    screen :{ 
        backgroundColor: Color.primaryColor,
    },
    container :{
        flex: 1,

        backgroundColor: Color.primaryColor,
        paddingTop: 10
    },
    cmntBox :{
        justifyContent: 'flex-end',
        backgroundColor: Color.primaryColor,
        paddingBottom: 5,

    }
});

export default CommentModal;