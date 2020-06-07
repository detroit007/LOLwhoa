import React from 'react';
import { View,
         Text,
         StyleSheet,
         Image,
         TouchableOpacity,
         Dimensions,
         ScrollView,
         KeyboardAvoidingView,
         TouchableWithoutFeedback, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


import TextInputBox from '../../components/TextInputBox';
import ButtonBox from '../../components/ButtonBox'

const WIDTH = Dimensions.get('window').width;

const UploadURLScreen = props => {

return (
    <TouchableWithoutFeedback onPress={()=> { Keyboard.dismiss();}}>
        <ScrollView>
          <KeyboardAvoidingView behavior='position' style={styles.container}>
              <View>
                <Text style={styles.contactText}>Upload Meme from URL</Text>
              </View>
              <View style={styles.contactForm}>
                <Image
                    style={{width:150, color: 'white', height:150, marginBottom:5}}
                    source={require('../../assets/img/image-upload.png')} />
                <TextInputBox
                    placeholder="IMAGE URL"
                    returnKeyType="next"
                    keyboardType='url'
                    style={styles.input} />
                <TextInputBox
                    placeholder="TITLE"
                    returnKeyType="next"
                    keyboardType='default'
                    style={styles.input} />
                <TextInputBox
                    placeholder="TAG"
                    returnKeyType="next"
                    keyboardType='default'
                    style={styles.input} />
                <TextInputBox
                    placeholder="CATEGORY"
                    returnKeyType="go"
                    style={styles.input}  />

                <ButtonBox style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Post</Text>
                </ButtonBox>

          </View>
        </KeyboardAvoidingView>
        </ScrollView>
        </TouchableWithoutFeedback>
        );
      }


    const styles = StyleSheet.create({
        container: {
          flex:1,
          backgroundColor: '#252525',
          padding: 10
        },
        contactText: {
          color:'white',
          borderBottomWidth: 1,
          borderBottomColor: 'white',
          fontSize: 15,
          fontWeight: 'bold'
        },
        contactForm: {
          alignItems:'center',
          justifyContent:'center',
          paddingTop:20
        },
        input: {
          width:(WIDTH-60),
          height: 50,
          backgroundColor: '#363636',
          paddingHorizontal: 10,
          color: 'white',
          marginBottom: 5,
        },
        buttonContainer: {
          backgroundColor: 'black',
          paddingVertical: 15,
          marginBottom:10,
          marginTop:10,
          width: (WIDTH-60)
        },
        buttonText: {
          color: 'white',
          textAlign: 'center',
          fontWeight: '700',
          fontSize: 15,
        },
      });

  export default UploadURLScreen;
