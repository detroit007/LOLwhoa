import React, {useState, useEffect} from 'react';
import {Modal, Alert, View,BackHandler, ActivityIndicator, StyleSheet, FlatList} from 'react-native';
import CommentBox from '../../components/CommentBox';
import CommentText from '../../components/CommentText';
import Color from '../../constants/Color';
import AsyncStorage from '@react-native-community/async-storage';
import ApiConfig from '../../server/ApiConfig';


const ReplyModal = props => {

  const [upCount, setUpCount] = useState(false);
    const [downCount, setDownCount] = useState(false);

    const [commentData, setCommentData] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [cmntId, setcmntId] = useState('');
    const [GCommentId, setGCommentId] = useState('');
    const [GMemeId, setGMemeId] = useState('');

    const [accessToken, setAccessToken] = useState(''); 
    const [commentValue, setCommentValue] = useState('');

    const onCommentChangeHandler = val => {
        setCommentValue(val);
    }

    const getData = async () => {
      let value = await AsyncStorage.getItem('access_token');
          let slug = await AsyncStorage.getItem('slug');
          let uuid = await AsyncStorage.getItem('uuid');
          let commentId = await AsyncStorage.getItem('commentId');
          let memeId = await AsyncStorage.getItem('memeId');
          let commentIndex = await AsyncStorage.getItem('commentIndex');

          if(commentId != null && memeId != null){
            setGCommentId(commentId);
            setGMemeId(memeId);
            
          }
          if(value !== null) {
            setAccessToken(value);
        }
        if(slug != null && uuid != null){
        fetch(`https://lolwhoa.com/api/${slug}/${uuid}`)
        .then(res => res.json())
        .then(data => {
            if(data.memes.comments.length == 0){
                setCommentData([]);
            }
            if(!isNaN(commentIndex)){
                setCommentData(data.memes.comments[commentIndex].replies);
            }
            setLoading(false);
            }
        ).catch((err)=> {
          //
        })
      }   
        }


  const postLikeHandler = (id)=>{

    // if(upCount > DBcount){
    //   if(upCount > DBcount){
    //     setUpCount(DBcount);
    //   } else {
    //     setUpCount(DBcount - 1);
    //   }
    // } else {
    //   setUpCount(DBcount + 1);
    //   if(downCount > DBdownCount){
    //     setDownCount(downCount - 1);
    //   }
    // }

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
        console.log(data.message);
      } 
    }).
    catch(err=>{
      //
    })
  }

  const postDisLikeHandler = (id)=>{

    // if(downCount > DBcount){
    //   if(downCount > DBcount){
    //     setDownCount(DBcount);
    //   } else {
    //     setDownCount(DBcount - 1);
    //   }
    // } else {
    //   setDownCount(DBcount + 1);
    //   if(upCount > DBupCount){
    //     setUpCount(upCount - 1);
    //   }
    // }

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
          setDownCount(!downCount)
          console.log(data.message)
        }
      }).
      catch(err=>{
        //
      })
  }

  const getId = async() => {
    let id = await AsyncStorage.getItem('commentId');

    if(id !=null && id != {}){
        setcmntId(id);
    }
  }

  getId();
      
  useEffect(()=>{
    
      getData();
  },[cmntId, commentValue, upCount, downCount]);

  const sendReplyToServer = ()=>{
    getData();
    if(!commentValue){
      Alert.alert('Enter Something First')
    }else{
    fetch(ApiConfig.REPLY_ON_COMMENT_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        comment_body: commentValue,
        comment_id: GCommentId,
        meme_id: GMemeId,
      })
    })
    .then(res => res.json())
    .then(data => { 
      console.log(data)
      setCommentValue('');
  }).catch(e=>{
    //
  });
}}

const renderReplyData = itemData => {
    return(
      <CommentText 
        commentTitleName={itemData.item.user.name}
        UserProfile={itemData.item.UserAvatar != null ?
                {uri: `${ApiConfig.PROFILE_URL}${itemData.item.UserAvatar}`}
            : require('../../assets/img/default_male.png')}
        comment={itemData.item.body}
        upvotesCount={ itemData.item.upvotes}
        downvotesCount={itemData.item.downvotes}
        totalCommentCount={ itemData.item.repliesCount}
        onLikePress={()=>{
          postLikeHandler(itemData.item.id)
        }}
        onDisLikePrss={()=>postDisLikeHandler(itemData.item.id)}
      />
    )
}

return(
  <View style={styles.screen}>
      <Modal
        animationType="fade"
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
              renderItem={renderReplyData}
              keyExtractor={(key, index)=>  index.toString()}
          />
           </View>
    }
    
     <CommentBox style={styles.cmntBox}
       onCommentChange={onCommentChangeHandler}
       cmntValue={commentValue}
       onSubmit={()=>{
        sendReplyToServer()}}
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

export default ReplyModal;