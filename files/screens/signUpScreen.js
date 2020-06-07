import React, {useState, useEffect} from 'react';
import {View,
        Text,
        Image,
        StyleSheet,
        Keyboard,
        Dimensions,
        TouchableWithoutFeedback,
        KeyboardAvoidingView,
        Alert,
        ActivityIndicator,
        TouchableOpacity,
        BackHandler,
        } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import TextInputBox from '../components/TextInputBox';
import ButtonBox from '../components/ButtonBox';
import FooterBox from '../components/FooterBox';
import Color from '../constants/Color';
import TextErrorShow from '../components/TextErrorShow';

import { ImageCache } from '../components/ImageCache';


const WIDTH = Dimensions.get('window').width;

const signUpScreen = props => {

const [passTextEntry, setPassTextEntry] = useState(true);
const [passTextEntry1, setPassTextEntry1] = useState(true);
const [passIcon, setPassIcon] = useState('eye-slash');
const [passIcon1, setPassIcon1] = useState('eye-slash');

const [loading, setIsLoading] = useState(false);

const [input, setInput] = useState({name:'', email:'', pass:'', confirmPass:''});

const [nameErr, setNameErr] = useState(false);
const [emailErr, setEmailErr] = useState(false);
const [passErr, setPassErr] = useState(false);
const [confirmPassErr, setConfirmPassErr] = useState(false);
const [comparePassErr, setComparePassErr] = useState(false);



const passSecureEntry = () => {
    if(passTextEntry){
        setPassTextEntry(false);
        setPassIcon('eye');
    }else if(!passTextEntry){
        setPassTextEntry(true);
        setPassIcon('eye-slash');
    }
}

const passSecureEntry1 = () => {
    if(passTextEntry1){
          setPassTextEntry1(false);
          setPassIcon1('eye');
      }else if(!passTextEntry1){
          setPassTextEntry1(true);
          setPassIcon1('eye-slash');
      }
}

const handleBackButton = () => {

  if (props.navigation.isFocused()) {
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

const signUpUserHandler = () =>{
setNameErr(false);
setEmailErr(false);
setPassErr(false);
setConfirmPassErr(false);
setComparePassErr(false);

const regName =  /^[a-z0-9]+$/i;
const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
if(!regName.test(input.name)){

      setNameErr(true);

    }else if(!reg.test(input.email)){

      setEmailErr(true);

    }
    else if(!input.pass.length > 8 || input.pass.length < 8 ) {

      setPassErr(true);

    }else if(!input.confirmPass.length > 8 || input.confirmPass.length < 8 ) {

      setConfirmPassErr(true);
      PassErrorText = 'Invalid Confirm Password';

    }else if(input.pass !== input.confirmPass ) {

      setComparePassErr(true);
      PassErrorText = 'confirm password not match';

     }
    else {
    fetch('https://lolwhoa.com/api/apiregister', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: input.name,
            email: input.email,
            password: input.pass,
            password_confirmation: input.confirmPass,
          })
        })
        .then(res => res.json())
        .then(data => {
          setIsLoading(true);
          if(data.status){
            setIsLoading(false);
            props.navigation.navigate('Login');
            
          } else{
            setIsLoading(false);

            Alert.alert(
              'LolWhoa Says:',
              'Something went wrong...', [{
                  text: 'Cancel',
                  style: 'cancel'
              }, {
                  text: 'OK',
              }]
           )
          }
        })
        .catch(error => {
          setIsLoading(false);
          //
        });
      }
    }

if(loading){
return(
    <View style={{flex: 1,backgroundColor: Color.primaryColor, justifyContent: 'center'}} >
        <ActivityIndicator color='white' size='large' />
    </View>
);
}else{
return(

<View style={styles.screen} >
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <KeyboardAvoidingView behavior='height' >

      <View style={styles.container}>

        <View style={styles.imgCont}>
          <ImageCache style={styles.imgStyle}
            source={require('../assets/img/logo.png')}
          />
        </View>

            <TextInputBox
              placeholder = 'Enter Your Name'
              maxLength={30}
              value={input.name}
              onChangeText={text => setInput({ ... input, name: text})}
            />
            {nameErr ? <TextErrorShow text='Name is required'/> : null}

            <TextInputBox
              placeholder = 'Enter Your Email'
              maxLength={40}
              value={input.email}
              onChangeText={text => setInput({ ... input, email: text})}
              keyboardType='email-address'
            />
            {emailErr ? <TextErrorShow text='Invalid Email'/> : null}


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
               size={18} color='white'  />
            </TouchableOpacity>
          </View>
          {passErr ? <TextErrorShow text='Invalid or Short password'/> : null}


          <View style={styles.passInputStyle}>
              <TextInputBox
                placeholder = 'Enter Confirm Password'
                style={styles.passTxtInput}
                value={input.confirmPass}
                onChangeText={text => setInput({ ... input, confirmPass: text})}
                secureTextEntry={passTextEntry1}
                maxLength={30}
                placeholderTextColor= {Color.placeholderColor}
              />

              <TouchableOpacity onPress={passSecureEntry1}
               style={{ justifyContent: 'center', left: -25}}>
               <Icon name={passIcon1}
                 size={18} color='white'  />
              </TouchableOpacity>
          </View>
          {confirmPassErr ? <TextErrorShow text='Invalid Confirm Password'/> : null}
          {comparePassErr ? <TextErrorShow text='Confirm Password not match'/> : null}

          

        <ButtonBox style={styles.btnStyle} onPress={signUpUserHandler}>
          <Text>Sign up</Text>
        </ButtonBox>

        <View style={styles.textRow}>

           <Text style={{color: 'white', fontSize: 13}}>Already have an account? </Text>

           <TouchableOpacity onPress={()=> props.navigation.navigate('Login')}>

             <Text style={styles.signInText}>
               Login
             </Text>

           </TouchableOpacity>

           <Text style={{color: 'white'}}> now.</Text>

        </View>
      </View>

    </KeyboardAvoidingView>
  </TouchableWithoutFeedback>

    <FooterBox  style={styles.footerCont}/>

</View>
);
}
};

const styles = StyleSheet.create({
screen :{
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: Color.primaryColor,
},
container :{
    padding: 20
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
signInText :{
    color: 'white',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    fontSize: 13,
},
footerCont :{

}

});

export default signUpScreen;