import React, {useState, useEffect} from 'react';
import { View,
         Text,
         StyleSheet,
         Image,
         TouchableOpacity,
         Dimensions,
         BackHandler,
         Alert,
         Picker,
         TouchableWithoutFeedback, Keyboard } from 'react-native';
         
import Color from '../../constants/Color';

import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';

import TextInputBox from '../../components/TextInputBox';
import ButtonBox from '../../components/ButtonBox'
import ApiConfig from '../../server/ApiConfig';
import TextErrorShow from '../../components/TextErrorShow';
import DrawerScreenBox from '../../modals/DrawerScreenBox';

import { ImageCache } from '../../components/ImageCache';


const WIDTH = Dimensions.get('window').width;

const UploadGalleryScreen = props => {

  const [avatarSource, setAvatarSource] = useState(null);
  const [accessToken, setAccessToken] = useState('');

  const [titleErr, setTtitleErr] = useState(false);
  const [tagErr, setTagErr] = useState(false);
  
  const [input, setInput] = useState({title:'', tags:'',category:''});

  const options = {
      title: 'Select Avatar',
      customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
          skipBackup: true,
          path: 'images',
      },
  };

  const show = () => {
      
      ImagePicker.showImagePicker({
          noData: true,
          mediaType: 'photo',
          allowsEditing: true,
          quality: 0.7
      }, (response) => {
          if(response.uri){
        
            // You can also display the image using data:
            // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        
            setAvatarSource(response.uri.toString());
          }
      });
  }

  const handleBackButton = () => {
    if(props.navigation.isFocused()){
      props.navigation.goBack();
  }
  return true;
}

// body: JSON.stringify({
//   'img': {uri: avatarSource.uri, name: 'photo.jpg', type: 'image/jpg'},
//   'title': input.title,
//   'tags': input.tags,
//   'category': input.category,
// }),

  
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  },[]);

  const uploadToServer = () => {
    setTtitleErr(false);
    setTagErr(false);
      getToken();
      if(avatarSource == null) {
        Alert.alert('Choose Image first');
      } else if(!input.title){
          setTtitleErr(true);
      }else if(!input.tags){
        setTagErr(true);
    }else if(input.category == 0){
      Alert.alert(
        'LolWhoa Says:',
        'Choose Category.', [{
            style: 'cancel'
        }, {
            text: 'OK',
        }]
     )
    }
      else {
        let uploadData = new FormData();
        uploadData.append('img', {uri: avatarSource, name: 'photo.jpg', type: 'image/jpg'});
        uploadData.append('title', input.title);
        uploadData.append('tags', input.tags);
        uploadData.append('category', input.category);

        fetch(ApiConfig.CREATE_MEME_URL, { 
          method: 'POST',
          headers:{  
              Accept: 'application/json',
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${accessToken}`,
          },
          body: uploadData,
        })
        .then(res=> res.json())
        .then(res=> {
            if(res.status){
                setAvatarSource(null);
                setInput({...input, title:'', tags:'', category:''})

                Alert.alert(
                  'LOLwhoa says',
                  'Successfully Uploaded!', [{
                      style: 'cancel'
                  }, {
                      text: 'OK',
                      onPress: () => {
                        props.navigation.push('HomeScreen')
                      }
                  }, ], {
                   cancelable: false
                }
             )

            }else{
              Alert.alert(
                'LolWhoa Says:',
                'Something went wrong.', [{
                    style: 'cancel'
                }, {
                    text: 'OK',
                }]
             )}
        })
        .catch((e) => {
          Alert.alert(
            'LolWhoa Says:',
            'check connection', [{
                style: 'cancel'
            }, {
                text: 'OK',
            }]
         )
        });

      }
  }

  const getToken = async () => {
    try {
      let value = await AsyncStorage.getItem('access_token')
      if(value !== null) {
          setAccessToken(value);
      }
    } catch(e) {
      Alert.alert(e.message)
    }
  }

return (
    <TouchableWithoutFeedback onPress={()=> { Keyboard.dismiss();}}>
<DrawerScreenBox navigation={props.navigation}>
      <View style={styles.mainCont} >
              <View>
                <Text style={styles.contactText}>Upload Meme</Text>
              </View>
        <View style={styles.container}>
          <View style={styles.contactForm}>

            <TouchableOpacity onPress={show} style={{alignItems: 'center', marginBottom: 15}}>
              {avatarSource != null ?  
                <Image style={{width:150, height: 150}} source={{ uri: avatarSource}}/> : 
                <ImageCache style={{width: 150, height: 150}} 
                  source={require('../../assets/img/image-upload.png')}/>
              }
            </TouchableOpacity>
            
              <Text style={{paddingTop: 5, color: 'white', textAlign: 'center'}}>Add Image</Text>

              <TextInputBox
                  placeholder="TITLE"
                  returnKeyType="next"
                  keyboardType='default'
                  onChangeText={text=>setInput({...input, title: text})}
                  value={input.title}
                  style={styles.input} 
              />
              {titleErr ? <TextErrorShow text='Title required' /> : null}

              <TextInputBox
                  placeholder="TAG"
                  returnKeyType="next"
                  keyboardType='default'
                  onChangeText={text=>setInput({...input, tags: text})}
                  value={input.tags}
                  style={styles.input} 
              />
              {tagErr ? <TextErrorShow text='Tag required' /> : null}



                <Picker
                  selectedValue={input.category}
                  mode='dropdown'
                  style={styles.picker}
                  onValueChange={ itemValue =>
                    setInput({...input, category:itemValue})}
                  >
                  <Picker.Item label="Categories" value='0'/>
                  <Picker.Item label="Funny" value="28" />
                  <Picker.Item label="Cartoon" value="24" />
                  <Picker.Item label="Animals" value="23" />
                  <Picker.Item label="Staff Pics" value="22" />
                  <Picker.Item label="Game Of Thrones" value="20" />
                  <Picker.Item label="Sports" value="19" />
                  <Picker.Item label="Odly Satisfying" value="18" />
                  <Picker.Item label="Gaming" value="17" />
                  <Picker.Item label="Aww" value="16" />
                </Picker>

              <ButtonBox style={styles.buttonContainer} onPress={()=>uploadToServer()}>
                  <Text style={styles.buttonText}>Post</Text>
              </ButtonBox>

              </View>
       </View>
    </View>
    </DrawerScreenBox>
   </TouchableWithoutFeedback>
        );
      }


    const styles = StyleSheet.create({
        mainCont :{
            flex: 1,
            backgroundColor: Color.primaryColor
        },
        container :{
          alignItems: 'center',
        },
        contactText: {
          color:'white',
          borderBottomWidth: 1,
          borderBottomColor: 'white',
          fontSize: 15,
          fontWeight: 'bold'
        },
        contactForm: {
          paddingTop:20
        },
        input: {
          paddingHorizontal: 10,
          marginBottom: 5,
        },
        buttonContainer: {
          backgroundColor: 'black',
          marginTop:20,
          width: WIDTH * 0.89,
        },
        picker :{
          backgroundColor: Color.accent,
          color: Color.primaryColor,
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: 'white',
          width: Dimensions.get('window').width * 0.89,
          height: 50,
          borderRadius: 4,
          color: 'white',
          marginVertical: 10,
          fontSize: 16,
        }
      });

  export default UploadGalleryScreen;