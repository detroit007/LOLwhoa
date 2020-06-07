import React, {useState, useEffect} from 'react';
import { StyleSheet,
         Text,
         View,
         Dimensions,
         Image,
         TouchableOpacity,
         Alert,
         BackHandler,
         ActivityIndicator,
         TouchableWithoutFeedback,
         Keyboard, 
         NativeModules,
         Button
        } from 'react-native';

import { LoginButton, AccessToken, LoginManager } from 'react-native-fbsdk';

import TextInputBox from '../components/TextInputBox';
import ButtonBox from '../components/ButtonBox';
import FooterBox from '../components/FooterBox';
import Color from '../constants/Color'

import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';
import TextErrorShow from '../components/TextErrorShow';

import { ImageCache } from '../components/ImageCache';


const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;



const LoginScreen = props => {

  const { RNTwitterSignIn } = NativeModules;

  const Constants = {
    //Dev Parse keys
    TWITTER_COMSUMER_KEY: "W8XvU6qkuUpZ0CGA4sYigYyAI",
    TWITTER_CONSUMER_SECRET: "G6uK3zf2EkkknIaCTPZpDmebm1lplvxmtMow7L4HBlUyAQuvRm"
  }

const [loading, setIsLoading] = useState(false);
const[input, setInput] = useState({email:'', pass:''})

const [emailError, setEmailError] = useState(false);
const [passError, setPassError] = useState(false);

const [passTextEntry, setPassTextEntry] = useState(true);
const [passIcon, setPassIcon] = useState('eye-slash');


const loginWithFacebook = () => {
  LoginManager.logInWithPermissions(['email']).then(
    function(result) {
       if (result.isCancelled) {
        console.log('Login cancelled');
      } else {
          result.grantedPermissions.toString();
        AccessToken.getCurrentAccessToken().then(data => {
          fetch('https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=' + data.accessToken).
          then(res=> res.json()).
          then(loginData=>{
            fetch('https://lolwhoa.com/api/api-social-login/callback',{
                        method : 'POST',
                        headers :{
                          'Accept': 'application/json',
                          'Content-Type' : 'application/json',
                        },
                        body :JSON.stringify({
                          provider_id: loginData.id,
                          name : loginData.name,
                          email: loginData.email,
                          provider: 'facebook',
                        })
                      }).
                      then(res=> res.json()).
                      then(data=>{
                        console.log(data);
                        storeData(data);
                        userSetData(data.user);
                        props.navigation.replace('HomeScreen');
                      }).
                      catch(err=>{
                        setIsLoading(false);
                        //
                      });
                  })
              });
      }
    }
  );
};



 
const twitterSignIn = () => {

  setIsLoading(true);
  RNTwitterSignIn.init(Constants.TWITTER_COMSUMER_KEY, Constants.TWITTER_CONSUMER_SECRET)
  RNTwitterSignIn.logIn()
    .then(loginData => {
      const { authToken, authTokenSecret } = loginData
      if (authToken && authTokenSecret) {

        fetch('https://lolwhoa.com/api/api-social-login/callback',{
          method : 'POST',
          headers :{
            'Accept': 'application/json',
            'Content-Type' : 'application/json',
          },
          body :JSON.stringify({
            provider_id: loginData.userID,
            name : loginData.name,
            email: null,
            provider: 'twitter',
          })
        }).
        then(res=> res.json()).
        then(data=>{
          storeData(data);
          userSetData(JSON.stringify(data.user));
          props.navigation.replace('HomeScreen');
          setIsLoading(false);
        }).
        catch(err=>{
          setIsLoading(false);
          console.log('api error', err)
        });
    }
    }).
      catch(error => {
        setIsLoading(false);
        console.log('library throw error', error)
    
    })
  }

  const passSecureEntry = () => {
      if(passTextEntry){
          setPassTextEntry(false);
          setPassIcon('eye');
      }else if(!passTextEntry){
          setPassTextEntry(true);
          setPassIcon('eye-slash');
      }
  }


  const handleBackButton = () => {

    if (props.navigation.isFocused()) {
        if(props.navigation.popToTop()){
          props.navigation.popToTop();
          setIsLoading(false);
        }else{
          setIsLoading(false);
          BackHandler.exitApp();
        }
    }
  return true;
    }

  useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
      };
    },[]);


const loginUserHandler = () =>{

  setEmailError(false);
  setPassError(false);

  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;

  if(!reg.test(input.email)){
        setIsLoading(false);
        setEmailError(true);
    } else if(!input.pass.length > 8 || input.pass.length < 8 ) {
        setIsLoading(false);
        setPassError(true)
        // alert('Password must be 8 characters');
    } else {
          fetch('https://lolwhoa.com/api/apilogin', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: input.email,
              password: input.pass,
            })
          })
          .then(res => res.json())
          .then(data => {
            if(data.status){
              storeData(data);
              userSetData(data.user);
              setInput({email:'', pass:''});
              props.navigation.replace('HomeScreen');
              setIsLoading(false);
            } else{
              Alert.alert(
                'LolWhoa Says:',
                'Invalid Credentials.', [{
                    style: 'cancel'
                }, {
                    text: 'OK',
                }]
            )
          setIsLoading(false);
            }
          })
          .catch(error => {
          setIsLoading(false);
        //   Alert.alert(
        //     'LolWhoa Says:',
        //     'Check Connection.', [{
        //         style: 'cancel'
        //     }, {
        //         text: 'OK',
        //     }]
        // )
          });
          setIsLoading(true);
        }
}

const storeData = async (val) => {
  // if(val,access_token && val.userID && val.name){
  //   setAccessToken(val.access_token);
  // }
  if(val.accessToken ){
    await AsyncStorage.setItem('access_token', val.accessToken)
    await AsyncStorage.setItem('user_avatar', val.user.avatar);
    await AsyncStorage.setItem('loginUser_id', JSON.stringify(val.user.id));
    await AsyncStorage.setItem('user_name', val.user.name);
    // await AsyncStorage.setItem(JSON.stringify('userData', val.user));

  }else{
    await AsyncStorage.setItem('access_token', val.access_token)
    await AsyncStorage.setItem('user_name', val.user.name);
    await AsyncStorage.setItem('user_avatar', val.user.avatar);
    await AsyncStorage.setItem('loginUser_id', JSON.stringify(val.user.id));
    // await AsyncStorage.setItem(JSON.stringify('userData', val.user));

  }
}

const userSetData = async(val) =>{
    await AsyncStorage.setItem('userData', JSON.stringify(val));
}



if( loading){
return(
    <View style={{flex: 1,backgroundColor: Color.primaryColor, justifyContent: 'center'}} >
        <ActivityIndicator color='white' size='large' />
    </View>
);
}else{
return(
<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
  <View style={styles.screen} >
        <View style={styles.container}>

          <View style={styles.imgCont}>
            <ImageCache style={styles.imgStyle}
              source={require('../assets/img/logo.png')}
            />
          </View>
              <TextInputBox
                placeholder = 'Enter Your Email'
                value={input.email}
                onChangeText={text => setInput({ ... input, email: text})}
                maxLength={40}
                keyboardType='email-address'
              />
              {emailError ? <TextErrorShow text='Invalid Email'/> : null}

            <View style={styles.passInputStyle}>
              <TextInputBox
                placeholder = 'Enter Your Password'
                style={styles.passTxtInput}
                secureTextEntry={passTextEntry}
                value={input.pass}
                onChangeText={text => setInput({ ... input, pass: text})}
                maxLength={30}
                placeholderTextColor= {Color.placeholderColor}
              />

              <TouchableOpacity onPress={passSecureEntry}
               style={{ justifyContent: 'center', left: -25}}>
               <Icon name={passIcon}
                 size={15} color='white'  />
              </TouchableOpacity>
            </View>
            {passError ? <TextErrorShow text='Invalid or Short Password'/> : null}



            <TouchableOpacity onPress={()=> {
              props.navigation.navigate('ForgetPass')}}>
              <Text style={styles.forgetText}>Forget Your Password?</Text>
            </TouchableOpacity>

              <ButtonBox style={styles.btnStyle} onPress={loginUserHandler}>
                <Text>Login</Text>
              </ButtonBox>

          <View style={styles.textRow}>
             <Text style={{color: 'white'}}>Don't have an account? </Text>
             <TouchableOpacity onPress={()=> {
               props.navigation.navigate('SignUp')}}>
               <Text style={{color: 'white', textDecorationLine: 'underline', fontWeight: 'bold'}}>
                 Sign Up
               </Text>
             </TouchableOpacity>
             <Text style={{color: 'white'}}> now.</Text>
          </View>



        </View>

        <View style={styles.socialCont}>
          <TouchableOpacity 
            activeOpacity={0.9}
            style={{...styles.socialBtn,backgroundColor:'#00acee'}}
            onPress={twitterSignIn}
          >
            <Icon color='white' size={14} name='twitter'/>
            <Text style={{color: 'white', fontSize: 13, paddingLeft: 7, fontWeight: 'bold'}}>Twitter</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            style={{...styles.socialBtn,backgroundColor:'#4267B2', marginLeft: 15}}
            onPress={() => loginWithFacebook()}
          >
            <Icon name="facebook"  size={14} color="white" />

            <Text style={{color: 'white', fontSize: 13, paddingLeft: 7, fontWeight: 'bold'}}>
              Facebook
            </Text>
          </TouchableOpacity>

        </View>

        

    <FooterBox style={styles.footerCont}/>
  </View>

</TouchableWithoutFeedback>
  );
  }
}

const styles = StyleSheet.create({
    screen :{
      flex: 1,
      paddingTop: 50,
      justifyContent: 'space-between',
      backgroundColor: Color.primaryColor,
    },
    container :{
      padding: 20,
    },
    imgCont :{
      alignItems: 'center',
      marginVertical: 20,
    },
    imgStyle :{
      width: 150,
      height: 100,
      alignItems: 'center'
    },
    btnStyle :{
      height: 60,
      width: '100%',
      backgroundColor: 'black',
      marginTop: 20
    },
    textRow :{
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 5,
    },
    passInputStyle :{
      flexDirection: 'row',
    },
    forgetText: {
      color: 'white',
      textDecorationLine: 'underline',
      fontSize: 13,
      textAlign:'right'
    },
    socialCont :{
      flexDirection : 'row',
      justifyContent: 'center'

    },
    socialBtn :{
      flexDirection: 'row',
      paddingHorizontal: 10,
      paddingTop: 7,
      borderRadius: 6,
      width: 95,
      height: 30,
    }

});

  export default LoginScreen;
