import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, BackHandler, Dimensions, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import TextInputBox from '../../components/TextInputBox';
import ButtonBox from '../../components/ButtonBox';
import ApiConfig from '../../server/ApiConfig';
import TextErrorShow from '../../components/TextErrorShow';
import DrawerScreenBox from '../../modals/DrawerScreenBox';


const WIDTH = Dimensions.get('window').width;

const ContactScreen = (props) => {

const [input, setInput] = useState({name:'', email:'', message:''});
const [accessToken, setAccessToken] = useState('');
const [nameErr, setNameErr] = useState(false);
const [emailErr, setEmailErr] = useState(false);
const [messageErr, setMessageErr] = useState(false);

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


const sendDataToServer = ()=> {
setNameErr(false);
setEmailErr(false);
setMessageErr(false);
const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;

    if(!input.name){
      setNameErr(true)
    }else if(!reg.test(input.email)){
      setEmailErr(true);
  }else if(!input.message || input.message.length > 10){
    setMessageErr(true);
}else{
    fetch(ApiConfig.INBOX_LAUGH_URL, {
        method: 'POST',
        headers:{  
            Accept: 'application/json',
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: input.name,
            UserEmail: input.email,
            message: input.message
        })
    })
    .then(res=> res.json())
    .then(res=> { 
      if(res.status){
      setInput({name:'', email:'', message:''})
    } else{
      Alert.alert(
        'LolWhoa Says:',
        'Invalid Credentials.', [{
            text: 'Cancel',
            style: 'cancel'
        }, {
            text: 'OK',
        }]
     )
    }
   })
    .catch((e) => {
    //   
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
    <TouchableWithoutFeedback onPress={()=> { Keyboard.dismiss()}}>
    <DrawerScreenBox navigation={props.navigation}>
      <KeyboardAvoidingView behavior='padding' style={styles.container}>
      <Text style={styles.contactText}>Contact</Text>
      <View style={styles.contactContainer}>
        <View style={styles.contactForm}>

          <View style={{flexDirection:'row', justifyContent: 'center', marginBottom:5}}>
              <Icon color='white' size={14} style={{marginTop: 9}} name='send' />
              <Text style={styles.contactText2}>Want Some Inbox Laugh</Text>
          </View>

          <TextInputBox
              placeholder="NAME"
              returnKeyType="next"
              onChangeText={text => setInput({ ... input, name: text })}
              value={input.name}
              keyboardType='default'
              style={styles.input}
          />
          {nameErr ? <TextErrorShow text='Name required'/> : null}

          <TextInputBox
              placeholder="EMAIL"
              returnKeyType="next"
              onChangeText={text => setInput({ ... input, email: text })}
              value={input.email}
              keyboardType='email-address'
              style={styles.input}
          />
          {emailErr ? <TextErrorShow text='Invalid Email'/> : null}


          <TextInputBox
              placeholder="MESSAGE"
              placeholderTextColor="#6f6f6f"
              returnKeyType="done"
              onChangeText={text => setInput({ ... input, message: text })}
              value={input.message}
              keyboardType='default'
              style={{height:150, paddingTop:10}}
              multiline={true}
              textAlignVertical='top' 
          />
          {messageErr ? <TextErrorShow text='Message required'/> : null}


            <ButtonBox style={styles.buttonContainer} onPress={sendDataToServer}>
              Send
            </ButtonBox>

      </View>
    </View>  
    </KeyboardAvoidingView>
    </DrawerScreenBox>
    </TouchableWithoutFeedback>
    );
  }

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#252525'
    },
    contactContainer: {
      alignItems: 'center',
      backgroundColor: '#252525',
    },
    contactText: {
      color:'white',
      borderBottomWidth: 1,
      borderBottomColor: 'white',
      marginHorizontal: 7,
      fontSize: 15,
      fontWeight: 'bold'
    },
    contactText2: {
      color:'white',
      fontSize: 15,
      marginLeft:5,
      marginTop: 5
    },
    contactForm: {
      paddingTop: 50,
    },
    input: {
      paddingHorizontal: 10,
      marginBottom: 5,
    },
    buttonContainer: {
      marginTop:10,
      backgroundColor: 'black',
      width: WIDTH * 0.89,
    },
    buttonText: {
      color: 'white',
      textAlign: 'center',
      fontWeight: '700',
      fontSize: 15,
    },
  });

export default ContactScreen;