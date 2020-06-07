import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  NativeModules,
  Button,
  TouchableOpacity
} from 'react-native';

const { RNTwitterSignIn } = NativeModules;

const Constants = {
  //Dev Parse keys
  TWITTER_COMSUMER_KEY: "InPj4Gxa7ogfonkU2I4AM1YAz",
  TWITTER_CONSUMER_SECRET: "Rwe1vfXXZ1TUL0xAtsJWkrAafuTJzINuMFsSLu5LWxltc1IoLq"
}

// import TwitterButton from './TwitterButton';
const test = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    _twitterSignIn = () => {
        RNTwitterSignIn.init(Constants.TWITTER_COMSUMER_KEY, Constants.TWITTER_CONSUMER_SECRET)
        RNTwitterSignIn.logIn()
          .then(loginData => {
            console.log(loginData)
            const { authToken, authTokenSecret } = loginData
            if (authToken && authTokenSecret) {
                setIsLoggedIn(true);
            }
          })
          .catch(error => {
            console.log(error)
          }
        )
      }
    
      handleLogout = () => {
        console.log("logout")
        RNTwitterSignIn.logOut()
        setIsLoggedIn(true);
      }

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        {isLoggedIn
          ? <TouchableOpacity onPress={handleLogout}>
              <Text>Log out</Text>
            </TouchableOpacity>
          : <Button 
                name="logo-twitter" 
                style={styles.button} onPress={_twitterSignIn} 
                title="Login with Twitter"
            />
        }
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button: {
    height: 50,
  },
  icon: {
    width: 100,
    height: 30
  }
});

export default test;