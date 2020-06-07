import React, {useState, useEffect} from 'react';
import { View,
         Text,
         StyleSheet,
         Image,
         ScrollView,
         BackHandler,
         TouchableOpacity,
         Picker,
         Dimensions,
         TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';

         import Color from '../../constants/Color';

import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';

import TextInputBox from '../../components/TextInputBox';
import ButtonBox from '../../components/ButtonBox';
import ApiConfig from '../../server/ApiConfig';
import TextErrorShow from '../../components/TextErrorShow';
import DrawerScreenBox from '../../modals/DrawerScreenBox';

import { ImageCache } from '../../components/ImageCache';


const WIDTH = Dimensions.get('window').width;

const EditProfileScreen= props => {

  const [avatarSource, setAvatarSource] = useState(null);
  const [currentAvatar, setCurrentAvatar] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  const [nameErr, setNameErr] = useState(false);
  const [dErr, setDErr] = useState(false);
  const [mErr, setMErr] = useState(false);
  const [yErr, setYErr] = useState(false);
  const [countryErr, setCountryErr] = useState(false);
  const [bioErr, setBioErr] = useState(false);

  const [userPrsnlData, setPrsnlData] = useState('');

  const [input, setInput] = useState({full_name:'', gender:'', DD:'', MM:'', YY:'', country:'', bio:''});
  const options = {
      title: 'Select Avatar',
      customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
          skipBackup: true,
          path: 'images',
      },
  };

  const handleBackButton = () => {
    if(props.navigation.isFocused()){
      props.navigation.goBack();
  }
  return true;
}
  
  useEffect(() => {
    getToken();
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  },[]);

  const show = () => {
      
      ImagePicker.showImagePicker({
          noData: true,
          mediaType: 'photo',
          allowsEditing: true,
          quality: 0.7
      }, (response) => {
            if(response.uri){
              
            const source = { uri: response.uri };
        
            // You can also display the image using data:
            // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        
            setAvatarSource(source);
          
          }
      });
  }
  
  const uploadToServer = () => {
      getToken();
      setNameErr(false);
      setDErr(false);
      setMErr(false);
      setYErr(false);
      setCountryErr(false);
      setBioErr(false);
      if(avatarSource == null) {
        Alert.alert(
          'LolWhoa Says:',
          'Choose Image First.', [{
              style: 'cancel'
          }, {
              text: 'OK',
          }]
       )
      } else if(!input.full_name){
          setNameErr(true);
      }else if(input.gender == 0){
        Alert.alert(
          'LolWhoa Says:',
          'Choose Gender.', [{
              style: 'cancel'
          }, {
              text: 'OK',
          }]
       )
    }else if(!input.DD){
        setDErr(true);
    }else if(!input.MM){
      setMErr(true);
  }else if(!input.YY){
    setYErr(true);
}else if(!input.country){
  setCountryErr(true);
}else if(!input.bio){
  setBioErr(true);
}
 else{
      let uploadData = new FormData();
      uploadData.append('avatar', {uri: avatarSource.uri, name: 'photo.jpg', type: 'image/jpg'});
      uploadData.append('full_name', input.full_name);
      uploadData.append('gender', input.gender);
      uploadData.append('birthday', input.DD + '-' + input.MM + '-' + input.YY);
      uploadData.append('country', input.country);
      uploadData.append('bio', input.bio);

      fetch(ApiConfig.PROFILE_SETTINGS_URL, { 
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

          if(accessToken != null){
            fetch(ApiConfig.USER_DETAILS_URL,{
              method: 'POST',
              headers :{
                Accept : 'application/json',
                Authorization : `Bearer ${accessToken}`
              },
            }).
            then(res=>res.json()).
            then(result=>{
              let myAvatar = result.data.avatar;
              let myName = result.data.name;
              (async()=>{
                try{
                  await AsyncStorage.removeItem('user_name');
                  await AsyncStorage.removeItem('user_avatar');
          
                }finally{
                  await AsyncStorage.setItem('user_name', myName);
                  await AsyncStorage.setItem('user_avatar', myAvatar);
                }
              })();
            })
          }

          setAvatarSource(null);
          setInput({...input, full_name:'', gender:'', DD:'', MM:'', YY:'',country:'',bio:''})
          
          Alert.alert(
            'LOLwhoa says',
            'Successfully Updated!', [{
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
          'Something went wrong...', [{
              style: 'cancel'
          }, {
              text: 'OK',
          }]
       )
      }
      })
      .catch((e) => {
        Alert.alert(
          'LolWhoa Says:',
          'Check Connection.', [{
              style: 'cancel'
          }, {
              text: 'OK',
          }]
       )
      })
  }
}


  const getToken = async () => {
      let value = await AsyncStorage.getItem('access_token')
      let userData = await AsyncStorage.getItem('userData');
      let data = JSON.parse(userData);
      if(value !== null) {
          setAccessToken(value);
      }
      if(data != null){
        setPrsnlData(JSON.parse(data));
        setCurrentAvatar(userPrsnlData.avatar);

      }
  }

    return (
    <TouchableWithoutFeedback onPress={()=> { Keyboard.dismiss();}}>
    <DrawerScreenBox navigation={props.navigation}>
    <ScrollView style={styles.container}>
          <View >
            <Text style={styles.contactText}>Edit Profile</Text>
          </View>
    <View style={styles.contBox}>
        <View style={styles.contactForm}>

        <TouchableOpacity style={{alignItems: 'center'}} onPress={show}>
        {avatarSource != null || currentAvatar != null ?
           <Image source={ avatarSource ? avatarSource :
             {uri: `https://lolwhoa.com/uploads/users/${currentAvatar}`}}
            style={{width:120, alignSelf: 'center', height:120, borderRadius: 60, marginBottom:5}}/> :
          <ImageCache 
            source={ require('../../assets/img/default_male.png')} 
            style={{width:120, alignSelf: 'center', height:120, borderRadius: 60, marginBottom:5}} 
          />
        }
        </TouchableOpacity>
        
            <TextInputBox
                placeholder="FULL NAME"
                returnKeyType="next"
                onChangeText={text=>setInput({...input, full_name: text})}
                value={input.full_name}
                style={styles.input} 
            />
            {nameErr ? <TextErrorShow text='Name required'/> : null}

            <Picker
              selectedValue={input.gender}
              mode='dropdown'
              style={styles.picker}
              onValueChange={ itemValue =>
                setInput({...input, gender:itemValue})}
              >
              <Picker.Item label="Gender" value='0'/>
              <Picker.Item label="MALE" value="male" />
              <Picker.Item label="FEMALE" value="female" />
              <Picker.Item label="OTHERS" value="others" />
            </Picker>
            <View style={styles.dataBoxStyle}>
            <TextInputBox
                placeholder="DD"
                returnKeyType="next"
                onChangeText={text=>setInput({...input, DD: text})}
                value={input.DD}
                maxLength={2}
                keyboardType='numeric'
                style={styles.input2} />
            <TextInputBox
                placeholder="MM"
                returnKeyType="next"
                maxLength={2}
                onChangeText={text=>setInput({...input, MM: text})}
                value={input.MM}
                keyboardType='numeric'
                style={styles.input2}/>
            <TextInputBox
                placeholder="YYYY"
                returnKeyType="next"
                maxLength={4}
                onChangeText={text=>setInput({...input, YY: text})}
                value={input.YY}
                keyboardType='numeric'
                style={styles.input2}/>
            </View>
            {dErr || mErr || yErr ? <TextErrorShow text='Enter Your Date Of Birth'/> : null}

            <TextInputBox
                placeholder="COUNTRY"
                returnKeyType="next"
                onChangeText={text=>setInput({...input, country: text})}
                value={input.country}
                style={styles.input} 
            />
            {countryErr ? <TextErrorShow text='Country reuired'/> : null}

            <TextInputBox
                placeholder="BIO"
                returnKeyType="done"
                onChangeText={text=>setInput({...input, bio: text})}
                value={input.bio}
                style={styles.input, {height:100, paddingTop:10}}
                multiline={true}
                textAlignVertical='top' 
            />
            {bioErr ? <TextErrorShow text='Bio required'/> : null}

            <ButtonBox style={styles.buttonContainer} onPress={uploadToServer}>
                Save
            </ButtonBox>
          </View>
        </View>  
        
          </ScrollView>
    </DrawerScreenBox>
    </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
      flex:1,
      backgroundColor: '#252525',
      padding: 10,
    },
    contactText: {
      color:'white',
      borderBottomWidth: 1,
      borderBottomColor: 'white',
      fontSize: 15,
      fontWeight: 'bold'
    },
    contBox :{
      alignItems:'center',
    },
    contactForm: {
      justifyContent:'center',
      paddingTop:20
    },
    input: {
      // paddingHorizontal: 10,
      marginBottom: 5,
    },
    input2: {
        width: WIDTH * 0.27,
        marginHorizontal: 5,
      },
    dataBoxStyle :{
      flexDirection: 'row',

    },
    buttonContainer: {
      backgroundColor: 'black',
      paddingVertical: 15,
      marginBottom:10,
      marginTop:10,
      width: WIDTH * 0.89,
    },
    buttonText: {
      color: 'white',
      textAlign: 'center',
      fontWeight: '700',
      fontSize: 15,
    },
    picker :{
      backgroundColor: Color.accent,
      width: WIDTH * 0.89,
      height: 50,
      color: 'white',
      marginVertical: 10,
      fontSize: 16,
    }
  });

export default EditProfileScreen;