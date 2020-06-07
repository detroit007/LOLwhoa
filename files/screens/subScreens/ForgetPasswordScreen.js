import React, {useState, useEffect} from 'react';
import { View,
         StyleSheet,
         Image,
         Alert,
         BackHandler,
         Dimensions,
         ActivityIndicator,
         TouchableWithoutFeedback, Keyboard } from 'react-native';

import TextInputBox from '../../components/TextInputBox';
import ButtonBox from '../../components/ButtonBox'
import Color from '../../constants/Color'
import TextErrorShow from '../../components/TextErrorShow';

import { ImageCache } from '../../components/ImageCache';


const WIDTH = Dimensions.get('window').width;

const ForgetPasswordScreen = props => {

const [input, setInput] = useState({email:''});

const [loading, setIsLoading] = useState(false);

const [emailError, setEmailError] = useState(false);

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


const forgetPassEmailHandler = () =>{

  setEmailError(false);
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
  if(!reg.test(input.email)){
      setIsLoading(false);
      setEmailError(true);
    } else {
        fetch('https://lolwhoa.com/api/password/email', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: input.email,
          })
        })
        .then(res => res.json())
        .then(data => {
          
          if(data.status){
            setIsLoading(false);
            setInput({email: ''})
              props.navigation.navigate('Login');
              Alert.alert(
                'LolWhoa Says:',
                'Reset Link sent.', [{
                    text: 'Cancel',
                    style: 'cancel'
                }, {
                    text: 'OK',
                }]
             )
          }else{
            Alert.alert(
              'LolWhoa Says:',
              'Check Connection.', [{
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
        Alert.alert(
          'LolWhoa Says:',
          'Email does not exist', [{
              text: 'Cancel',
              style: 'cancel'
          }, {
              text: 'OK',
          }]
       )
        // 
        });
        setIsLoading(true);
      }
}

if(loading){
return(
    <View style={{flex: 1,backgroundColor: Color.primaryColor, justifyContent: 'center'}} >
        <ActivityIndicator color='white' size='large' />
    </View>
);
}else{
return (

<TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>

      <View style={styles.container}>

        <View style={styles.imgCont}>
              <ImageCache style={styles.imgStyle}
                source={require('../../assets/img/logo.png')}
              />
        </View>

        <TextInputBox
            placeholder="EMAIL ADDRESS"
            returnKeyType="next"
            style={styles.input}
            keyboardType='email-address'
            onChangeText={text=>setInput({ ... input, email: text})}
        />

        {emailError ? <TextErrorShow text='Invalid Email'/> : null }



        <ButtonBox onPress={forgetPassEmailHandler} style={styles.buttonContainer}>
            Send
        </ButtonBox>

      </View>
</TouchableWithoutFeedback>
    );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#252525',
      padding: 20,
    },
    imgCont :{
      alignItems: 'center',
      paddingVertical: 50,
    },
    imgStyle :{
      width: 150,
      height: 100,
      alignItems: 'center'
    },
    input: {
      height: 50,
      paddingHorizontal: 10,
    },
    buttonContainer: {
      backgroundColor: 'black',
      marginTop:25,
      width: WIDTH * 0.89,
      marginBottom: 12,
    }
  });

export default ForgetPasswordScreen;