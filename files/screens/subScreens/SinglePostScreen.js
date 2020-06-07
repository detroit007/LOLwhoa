import React, {useEffect, useState, useCallback} from 'react';
import {View, 
        Text, 
        StyleSheet, 
        Image,
        Alert,
        Platform,
        TouchableOpacity,
        ActivityIndicator,
        ScrollView,
        RefreshControl,
        BackHandler,
        FlatList,
        Dimensions,
        } from 'react-native';

import Color from '../../constants/Color';
import Icon from 'react-native-vector-icons/FontAwesome';
import PostImgBox from '../../modals/PostImgBox';

        
import AsyncStorage from '@react-native-community/async-storage';
import ApiConfig from '../../server/ApiConfig';
import DrawerScreenBox from '../../modals/DrawerScreenBox';
import Share from 'react-native-share';

import CommentBox from '../../components/CommentBox';
import CommentText from '../../components/CommentText';

import CommentModal from './CommentModal';
import ReplyModal from './ReplyModal';
import HomeScreen from '../HomeScreen';
import { ImageCache } from '../../components/ImageCache';

const SinglePostScreen = props => {

    const [refreshing, setRefreshing] = useState(false);

    const [postData, setPostData] = useState([]);
    const [commentData, setCommentData] = useState([]);

    const [imgUrl, setImgUrl] = useState(null);
    const [profileImg, setProfileImg] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [modalLoad, setModalLoad] = useState(false);
    const [accessToken, setAccessToken] = useState('');
    
    const [upCount, setUpCount] = useState(0);
    const [downCount, setDownCount] = useState(0);

    const [CupCount, setCUpCount] = useState(false);
    const [CdownCount, setCDownCount] = useState(false);

    const [memeId, setMemeId] = useState('');
    const [commentValue, setCommentValue] = useState('');
    const onCommentChangeHandler = val => {
        setCommentValue(val);
    }

    function wait(timeout) {
      return new Promise(resolve => {
        setTimeout(resolve, timeout);
      });
    }
    
    const onRefresh = useCallback(() => {
      setRefreshing(true);
    
      wait(500).then(() => setRefreshing(false));
    }, [refreshing]);
    
    const getData = async () => {
          let token = await AsyncStorage.getItem('access_token');
          let slug = await AsyncStorage.getItem('slug');
          let uuid = await AsyncStorage.getItem('uuid');
          setAccessToken(token);
          if(slug != null && uuid != null){

        fetch(`https://lolwhoa.com/api/${slug}/${uuid}`)
        .then(res => res.json())
        .then(data => {
          if(data.memes){
            setPostData([ ...postData, data.memes])
            setLoading(false)
            setCommentData(data.memes.comments)
            setImgUrl(`${ApiConfig.IMAGE_URL}${data.memes.file}`)
            if(data.memes.UserAvatar != null){
            setProfileImg(`${ApiConfig.PROFILE_URL}${data.memes.UserAvatar}`)
            }else{
              setProfileImg(null);
            }
            setMemeId(data.memes.id);

          }else{
            Alert.alert(
                  'LolWhoa Says:',
                  'Check Connection.', [{
                      style: 'cancel'
                  }, {
                      text: 'OK',
                  }]
               )
          }
            }
        ).catch((err)=> {
          //
        })
          }
      }

const handleBackButton = () => {
  if (props.navigation.isFocused()) {
    props.navigation.navigate('HomeScreen');

      // const resetAction = props.navigation.reset({
      //     index: 0,
      //     actions : [
      //     props.navigation.navigate('HomeScreen')],
      //   })
      //   props.navigation.dispatch('SinglePost');


    // if(Platform.Version === 24  ){
    //     props.navigation.goBack()
    // }
    // if( Platform.Version === 25){
    //    props.navigation.goBack();
    // }
    // if(Platform.Version === 26) {
    //   props.navigation.popToTop() 
    // }
    // if( Platform.Version === 27 ){
    //   props.navigation.popToTop() 
    // }
    if(Platform.Version === 26){
      props.navigation.goBack()
    }
  }
  return true;
    }
  
  useEffect(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackButton);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
      };
    });


    useEffect(() => {
      getData();
      },[commentValue, CupCount, CdownCount, refreshing ]);

    const userPostData = async(slug, id) =>{
        if(slug && id){
            await AsyncStorage.setItem('slug', slug);
            await AsyncStorage.setItem('uuid', id);
        }
        // setModalLoad(!modalLoad);
    }

    const upVoteHandler = (val, DBcount, DBdownCount) => {
        getData();
        val = val.toString();

        if(upCount > DBcount){
          if(upCount > DBcount){
            setUpCount(DBcount);
          } else {
            setUpCount(DBcount - 1);
          }
        } else {
          setUpCount(DBcount + 1);
          if(downCount > DBdownCount){
            setDownCount(downCount - 1);
          }
        }

            fetch(ApiConfig.LIKE_POST_URL,{
            method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type' : 'application/json',
                Authorization:`Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                value : 1,
                meme_id: val,
              }),
            }).
            then(response=> response.json()).
            then(data=> {
              console.log(data.message);
            }).
            catch(err=> Alert.alert(err.message));
        }

        const downVoteHandler = (val, DBcount, DBupCount) => {
            getData();
            val = val.toString();

            if(downCount > DBcount){
              if(downCount > DBcount){
                setDownCount(DBcount);
              } else {
                setDownCount(DBcount - 1);
              }
            } else {
              setDownCount(DBcount + 1);
              if(upCount > DBupCount){
                setUpCount(upCount - 1);
              }
            }
            
                fetch(ApiConfig.DISLIKE_POST_URL,{
                method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type' : 'application/json',
                    Authorization:`Bearer ${accessToken}`,
                  },
                  body: JSON.stringify({
                    value : 0,
                    meme_id: val,
                  }),
                }).
                then(response=> response.json()).
                then(data=> {
                  console.log(data.message);
                }).
                catch(err=> {
                  Alert.alert(err.message)
                });
            }

            const onShareHandler = (slug, uuid) => {
                const shareOptions = {
                    title: 'Share via',
                    message: 'some message',
                    url: `https://lolwhoa.com/${slug}/${uuid}`,
                    filename: 'test' , // only for base64 file in Android
                };
                Share.open(shareOptions).
                then(res=> res).
                catch(err => {
                  //
                });
            }

            const sendCommentToServer = ()=>{
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

                if(data.status){
                    userPostData(postData[0].slug, postData[0].uuid)
                }
                setCommentValue('');
            }).catch(e=>{
              //
            });
            }}

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
                  setCUpCount(!CupCount);
                }
                console.log(data.message)
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
                    setCDownCount(!CdownCount);
                  }
                  console.log(data.message)
                }).
                catch(err=>{
                  //
                })
            }

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
                  UserProfile={
                    itemData.item.UserAvatar != null ?
                          {uri: `${ApiConfig.PROFILE_URL}${itemData.item.UserAvatar }`}
                      : require('../../assets/img/default_male.png')}
                  onProfileImg={()=>{
                    onRandomPersonProfile(itemData.item.user.name, itemData.item.user.id)
                  }}
                  onTitleName={()=>{
                    onRandomPersonProfile(itemData.item.user.name, itemData.item.user.id)
                  }}
                  comment={itemData.item.body}
                  upvotesCount={itemData.item.upvotes}
                  downvotesCount={itemData.item.downvotes}
                  totalCommentCount={ itemData.item.repliesCount}
                  onLikePress={()=>{
                    !accessToken ? props.navigation.navigate('Login') :
                    postLikeHandler(itemData.item.id)}}
                  onDisLikePrss={()=>{
                    !accessToken ? props.navigation.navigate('Login') :
                    postDisLikeHandler(itemData.item.id)}}
                  onReplyPress={()=>{
                    !accessToken ? props.navigation.navigate('Login') :
                    onCancelHandler(itemData.item.id, itemData.item.meme_id, commentData.findIndex(x => x.body === itemData.item.body))}}
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

    if(isLoading){
        return(
            <View style={{flex: 1,backgroundColor: Color.primaryColor, justifyContent: 'center'}} >
                <ActivityIndicator color='white' size='large' />
            </View>
        );
        }else{
return(
  <View style={styles.screen}>
      
    <ScrollView 
      style={{backgroundColor: Color.primaryColor}}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >

    
    

      <View style={styles.container}>  

          <View style={styles.userInfoCont} >

              <View style={styles.userDetail}>

                    <View style={styles.userTitleInfo} >
                      
                        <TouchableOpacity 
                          onPress={()=>{onRandomPersonProfile(postData[0].user.name, postData[0].user.id)}} 
                          style={styles.btnImgUser} 
                        >
                          { profileImg ?
                          <Image style={{width: 60, height: 60}} source={{uri: profileImg}} /> :
                          <ImageCache style={{width: 60, height: 60}} source={require('../../assets/img/default_male.png')} />}
                        </TouchableOpacity>

                        <View style={{paddingLeft: 5}}>
                          <TouchableOpacity onPress={()=>{}}>
                              <Text style={{color: 'white'}} >{postData[0].title}</Text>
                          </TouchableOpacity>
                          <Text style={{color: 'white'}}>{postData[0].user.name} - {postData[0].date_age}</Text>
                        </View>
                    </View>

                    <View style={styles.postViewsInfo} >
                        <Icon name='eye' style={{paddingTop: 5}} color='white'/>
                        <Text style={{color: 'white'}} > views {postData[0].view_count} </Text>
                    </View>

              </View>

          </View>
            
          <View style={styles.userTagInfo} >
              <Icon name='tag'style={{paddingTop: 5}} color='white'/>

              <TouchableOpacity onPress={()=>{}}>
                  <Text style={{color: 'white'}}> {postData[0].tags} </Text>
              </TouchableOpacity>
          </View>

      </View>

  <PostImgBox style={{ height: 350}} source={imgUrl != null ? {uri: imgUrl} : require('../../assets/img/imageErr.png')}/>

  <View style={styles.reactBottomBar} >

     <View style={styles.reactionCont}>

        <TouchableOpacity onPress={()=>{
          !accessToken ? props.navigation.navigate('Login') :
          upVoteHandler(postData[0].id, postData[0].upvotes, postData[0].downvotes)}}>
           <Icon size={25} color='white' name='thumbs-up'/>
        </TouchableOpacity>
        <Text style={{padding: 5, color:'white'}}>{upCount > 0 ? upCount : postData[0].upvotes}</Text>

     </View>

     <View style={styles.reactionCont}>

        <TouchableOpacity onPress={()=>{
          !accessToken ? props.navigation.navigate('Login') :
          downVoteHandler(postData[0].id, postData[0].downvotes, postData[0].upvotes)}}>
           <Icon size={25} color= 'white' name='thumbs-down'/>
        </TouchableOpacity>
        <Text style={{padding: 5, color: 'white'}}>{downCount > 0 ? downCount : postData[0].downvotes}</Text>

     </View>

     <View style={styles.reactionCont}>

        <TouchableOpacity onPress={()=>{
          !accessToken ? props.navigation.navigate('Login') :
          userPostData(postData[0].slug, postData[0].uuid)}}>
           <Icon size={25} color= 'white' name='comment'/>
        </TouchableOpacity>
        <Text style={{padding: 5, color: 'white'}}>{postData[0].totalComments}</Text>

     </View>

     <View style={styles.reactionCont}>

        <TouchableOpacity onPress={()=>{
          !accessToken ? props.navigation.navigate('Login') :
          onShareHandler(postData[0].slug, postData[0].uuid)}}>
           <Icon size={25} color= 'white' name='share'/>
        </TouchableOpacity>
        <Text style={{padding: 5, color: 'white'}}>{postData[0].share_count}</Text>

     </View>
     
  </View>

  <CommentBox style={styles.cmntBox}
       onCommentChange={onCommentChangeHandler}
       cmntValue={commentValue}
       onSubmit={()=>{
        !accessToken ? props.navigation.navigate('Login') : 
        sendCommentToServer()}}
     />

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

    
      


    {/* <CommentModal
      modalVisible={modalLoad}
      onCancel={userPostData}
    /> */}

    {/* <View style={styles.comntView}>

    <View style={styles.comntCont}>
      <TextInput
        placeholder='comment'
        placeholderTextColor={Color.placeholderColor}
        style={styles.cmntTextBox}
        onChangeText={onCommentChangeHandler}
        value={commentValue}
      />
      <TouchableOpacity 
      style={styles.cmntBtn}
      onPress={()=>{
        sendCommentToServer();
      }}
      >
        <Text style={{color: 'white'}}>Send</Text>
      </TouchableOpacity>
    </View>
    </View> */}

    </ScrollView>
</View> 
)
};
}
const styles = StyleSheet.create({
    screen :{
        flex: 1,
        backgroundColor: Color.primaryColor,
        height: Dimensions.get('window').height,
    },
    container :{

    },
    userDetail :{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 10,
    },
    userInfoCont :{
        backgroundColor: Color.accent,
    },
    userTitleInfo :{
        flexDirection: 'row',
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
        borderRadius: 6,
    },
    userTagInfo :{
        flexDirection : 'row',
        paddingBottom: 5,
        backgroundColor: Color.accent,
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
        paddingRight: 10,
    },
    // comntView :{
    //   flex: 1,
    //   justifyContent: 'flex-end',
    //   backgroundColor: 'white',
    // },
    comntCont :{
        flexDirection: 'row',
        backgroundColor: Color.primaryColor,
        paddingHorizontal: 10,
        // marginTop: 39,
    },
    cmntTextBox :{
      width: '79%',
      padding: 10,
      height: 60,
      color: 'white',
      backgroundColor: Color.accent,
      borderRadius: 8,

    },
    cmntBtn :{
      width: '20%',
      justifyContent: 'center',
      marginLeft: 5,
      alignItems: 'center',
      height: 60,
      borderRadius: 8,
      backgroundColor: 'black',
      
    },
    container :{
      // flex: 1,
      backgroundColor: Color.primaryColor,
      paddingTop: 10
  },
  cmntBox :{
      justifyContent: 'flex-end',
      backgroundColor: Color.primaryColor,
      paddingTop: 15,

  }
});

export default SinglePostScreen;