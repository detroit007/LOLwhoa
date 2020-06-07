import React, {useState, useEffect} from 'react';
import { View,
         Text,
         StyleSheet,
         ScrollView,
         TouchableOpacity,
         BackHandler,
         Alert,
         Dimensions,
         KeyboardAvoidingView,
         TouchableWithoutFeedback, Keyboard } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import TextInputBox from '../../components/TextInputBox';
import ButtonBox from '../../components/ButtonBox'
import ApiConfig from '../../server/ApiConfig';

import AsyncStorage from '@react-native-community/async-storage';
import TextErrorShow from '../../components/TextErrorShow';
import DrawerScreenBox from '../../modals/DrawerScreenBox';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const AccountSettingScreen = props => {

const [secureTextEntry1, setSecureTextEntry1] = useState(true);
const [secureTextEntry2, setSecureTextEntry2] = useState(true);
const [secureTextEntry3, setSecureTextEntry3] = useState(true);
const [iconName1, setIconName1] = useState('eye-slash');
const [iconName2, setIconName2] = useState('eye-slash');
const [iconName3, setIconName3] = useState('eye-slash');

const [input, setInput] = useState({name:'', email:'', c_pass:'', n_pass:'', cn_pass:''});
const [accessToken, setAccessToken] = useState('');
const [flagData, setFlagData] = useState(0);

const [nameErr, setNameErr] = useState(false);
const [emailErr, setEmailErr] = useState(false);
const [currentPassErr, setCurrentPassErr] = useState(false);
const [newPassErr, setNewPassErr] = useState(false);
const [confirmNewPassErr, setConfirmNewPassErr] = useState(false);

      const onIconPress1 = () => {
        if(secureTextEntry1){
            setSecureTextEntry1(false);
            setIconName1('eye');
        }else if(!secureTextEntry1){
            setSecureTextEntry1(true);
            setIconName1('eye-slash');
        }

      }
      const onIconPress2 = () => {
        if(secureTextEntry2){
                    setSecureTextEntry2(false);
                    setIconName2('eye');
                }else if(!secureTextEntry2){
                    setSecureTextEntry2(true);
                    setIconName2('eye-slash');
                }
      }
      const onIconPress3 = () => {
        if(secureTextEntry3){
                    setSecureTextEntry3(false);
                    setIconName3('eye');
                }else if(!secureTextEntry3){
                    setSecureTextEntry3(true);
                    setIconName3('eye-slash');
                }
      }

      const handleBackButton = () => {
        if(props.navigation.isFocused()){
          props.navigation.goBack();
      }
      return true;
    }
      
      useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        return () => {
          BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        };
      },[]);

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

      const sendDataToServer = (value)=> {
      getToken();
      let URL = '';
      let data = new FormData();

      const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
      
      
      if(value === 1){
        setNameErr(false);
        setFlagData(0);
        setEmailErr(false);
        if(!input.name){
        setFlagData(0);
        setNameErr(true);
        }else if(!reg.test(input.email)){
        setFlagData(0);
        setEmailErr(true);
        }else{
        URL = ApiConfig.ACCOUNT_SETTINGS_URL;
        data.append('email', input.email);
        data.append('name', input.name);
        setFlagData(1);
      }
    } else if(value === 2){
      if(!input.c_pass.length > 8 || input.c_pass.length < 8){
        setCurrentPassErr(true);
        setFlagData(0);
      }else if(!input.n_pass.length > 8 || input.n_pass.length < 8){
        setFlagData(0);
        setNewPassErr(true);
      }else if(!input.cn_pass.length > 8 || input.cn_pass.length < 8){
        setFlagData(0);
        setConfirmNewPassErr(true);
      }else{
      URL = ApiConfig.PASSWORD_UPDATE_URL;
      data.append('old_password', input.c_pass);
      data.append('password', input.n_pass);
      data.append('password_confirmation', input.cn_pass);
      setFlagData(1);
      }}

      if(flagData === 1){
      fetch(URL, {
      method: 'POST',
      headers:{
      Accept: 'application/json',
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${accessToken}`,
      },
      body: data,
      })
      .then(res=> res.json())
      .then(res=> { 
        console.log(res);
        if(res.status){
        setFlagData(0);
        Alert.alert(
          'LolWhoa Says:',
          'Account Successfully Updated.', [{
              style: 'cancel'
          }, {
              text: 'OK',
          }]
       )
        setInput({...input, name:'', email:'', c_pass:'', n_pass:'', cn_pass:''})
      }else{
        Alert.alert(
          'LolWhoa Says:',
          'Invalid Credentials.', [{
              style: 'cancel'
          }, {
              text: 'OK',
          }]
       )
      } })
      .catch((e) => {
      //   Alert.alert(
      //     'LolWhoa Says:',
      //     'Check Connection.', [{
      //         style: 'cancel'
      //     }, {
      //         text: 'OK',
      //     }]
      //  )

        });
      }
    }

    return (
<TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
<DrawerScreenBox navigation={props.navigation}>
    <ScrollView>
  <KeyboardAvoidingView behavior='height' style={styles.container} >

      <View >

          <View>
            <Text style={styles.contactText}>Settings</Text>
          </View>

          <View style={styles.contactForm}>
            <View >
              <Text style={styles.contactText2}>Account Settings</Text>
            </View>
            <TextInputBox
                placeholder="NAME"
                returnKeyType="next"
                keyboardType='default'
                onChangeText={text=> setInput({...input, name: text})}
                value={input.name }
                style={styles.input} 
            />
            {nameErr ? <TextErrorShow text='Name required' /> : null}

            <TextInputBox
                placeholder="EMAIL ADDRESS"
                returnKeyType="next"
                onChangeText={text=> setInput({...input, email: text})}
                value={input.email}
                style={styles.input} 
            />
            {emailErr ? <TextErrorShow text='Invalid Email' /> : null}


            <ButtonBox style={styles.buttonContainer} onPress={()=>sendDataToServer(1)}>
                Save
            </ButtonBox>

            <View style={{paddingTop: 10}}>
                <Text style={styles.contactText2}>Password Settings</Text>
            </View>
            <View style={{flexDirection:'row'}}>

            <TextInputBox
                placeholder="CURRENT PASSWORD"
                secureTextEntry={secureTextEntry1}
                onChangeText={text=> setInput({...input, c_pass: text})}
                value={input.c_pass}
                returnKeyType="next"
                style={styles.input}
            />

                <TouchableOpacity style={styles.iconStyle} onPress={onIconPress1}>
                    <Icon name={iconName1} color="white" size={25} />
                </TouchableOpacity>
            </View>
            {currentPassErr ? <TextErrorShow text='Invalid Current Password' /> : null}


            <View style={{flexDirection:'row'}}>

            <TextInputBox
                placeholder="NEW PASSWORD"
                secureTextEntry={secureTextEntry2}
                onChangeText={text=> setInput({...input, n_pass: text})}
                value={input.n_pass}
                returnKeyType="go"
                style={styles.input}/>
                <TouchableOpacity style={styles.iconStyle} onPress={onIconPress2}>
                    <Icon name={iconName2}  color="white" size={25} />
                </TouchableOpacity>
            </View>
            {newPassErr ? <TextErrorShow text='Invalid or Short Password' /> : null}


            <View style={{flexDirection:'row'}}>

            <TextInputBox
                placeholder="CONFIRM NEW PASSWORD"
                secureTextEntry={secureTextEntry3}
                onChangeText={text=> setInput({...input, cn_pass: text})}
                value={input.cn_pass}
                returnKeyType="go"
                style={styles.input} />

                <TouchableOpacity style={styles.iconStyle} onPress={onIconPress3}>
                    <Icon name={iconName3}  color="white" size={25} />
                </TouchableOpacity>
            </View>
            {confirmNewPassErr ? <TextErrorShow text='Invalid or short Confirm Password' /> : null}


            <ButtonBox style={styles.buttonContainer} onPress={()=>sendDataToServer(2)}>
                Save
            </ButtonBox>
          </View>

      </View>
  </KeyboardAvoidingView>
  </ScrollView>
  </DrawerScreenBox>
</TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: HEIGHT,
      backgroundColor: '#252525',
      padding: 10,
    },
    contactText: {
      color:'white',
      borderBottomWidth: 1,
      borderBottomColor: 'white',
      fontSize: 18,
      fontWeight: 'bold'
    },
    contactText2: {
        color:'white',
        width: WIDTH * 0.89,
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        fontSize: 14,
        fontWeight: 'bold'
      },
    contactForm: {
      paddingTop:20,
      padding: 10,
    },
    input: {
      height: 50,
      paddingHorizontal: 10,
      marginBottom: 5,
    },
    iconStyle :{
        justifyContent: 'center',
        left: -35,
    },
    buttonContainer: {
      backgroundColor: 'black',
      marginTop:10,
      width: WIDTH * 0.89,
      marginBottom: 12,
    }
  });

export default AccountSettingScreen;