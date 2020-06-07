import React, { Component } from 'react';
import { StyleSheet, Text, Image, View, Dimensions, Alert } from 'react-native';
import Menu, {
MenuProvider,
MenuTrigger,
MenuOptions,
MenuOption,
} from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import Color from '../../constants/Color';

const PopUpMenu = props=> {

const selectNumber = (value) => {
alert(`selecting number: ${value}`);
}

return (
<MenuProvider >
  <View style={{...styles.container, ...props.style}}>
      <View style={styles.topbar}>

            <Menu name="nav" onSelect={value => selectNumber(value)}>
                
                <MenuTrigger style={styles.trigger}>
                    <Text style={[styles.text, styles.triggerText]}>
                        <Icon style={{marginLeft: 10}} name="pencil" size={30} color="white" />
                    </Text>
                </MenuTrigger>

                <MenuOptions customStyles={{ optionText: [styles.text] }}>

                    <View style={styles.wraper}>

                        <View style={{flexDirection:'row', alignItems:'center', paddingHorizontal:7}}>
                            <Icon name="pencil" color="white" size={20} />
                            <MenuOption value={1} text='Upload Image' />
                        </View>

                        <View style={{flexDirection:'row', alignItems:'center', paddingHorizontal:7}}>
                            <Icon name="pencil" color="white" size={20} />
                            <MenuOption value={2} text='Upload from URL' />
                        </View>

                        <View style={{flexDirection:'row', alignItems:'center', paddingHorizontal:7}}>
                            <Icon name="pencil" color="white" size={20} />
                            <MenuOption value={3} text='Create a Meme' />
                        </View>

                    </View>
                </MenuOptions>

            </Menu>

            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <TouchableOpacity>
                <Image style={{width: 60, height: 30}} source={require('../../assets/img/logo.png')}/>
                </TouchableOpacity>
            </View>

            <View style={{flexDirection: 'row'}}>

                <TouchableOpacity onPress={()=>{Alert.alert('good')}}
                    style={styles.text, {paddingTop: 8, paddingRight: 5}}>
                    <Icon name="search" color="white" size={25} />
                </TouchableOpacity >

              <Menu name="noti" onSelect={value => selectNumber(value)}>
                    
                    <MenuTrigger style={styles.trigger}>

                        <Text style={[styles.text, styles.triggerText]}>
                        <Icon name='bell' color="white" size={25} />
                        </Text>
                        
                    </MenuTrigger>

                    <MenuOptions customStyles={{ optionText: [styles.text] }}>

                        <View style={styles.wraper}>
                            <View 
                                style={{flexDirection:'row', justifyContent:'center', paddingHorizontal:7}}>
                                <Text style={styles.text}>Recent Notification</Text>
                            </View>

                        <View style={styles.divider} />

                            <View style={{flexDirection:'row', alignItems:'center', paddingHorizontal:7}}>
                                <Icon name="pencil" color="white" size={20} />
                                <MenuOption value={1} text='Create a Meme' />
                            </View>

                            <View style={{flexDirection:'row', alignItems:'center', paddingHorizontal:7}}>
                                <Icon name="pencil" color="white" size={20} />
                                <MenuOption value={2} text='Create a Meme' />
                            </View>

                            <View style={{flexDirection:'row', alignItems:'center', paddingHorizontal:7}}>
                                <Icon name="pencil" color="white" size={20} />
                                <MenuOption value={3} text='Create a Meme' />
                            </View>

                        </View>
                    </MenuOptions>
              </Menu>

            </View>
      </View>
  </View>
</MenuProvider>
);
}

const styles = StyleSheet.create({
container: {
    flexDirection: 'column',
    backgroundColor: 'blue',
    width: Dimensions.get('window').width,
    borderBottomColor: Color.accent,
    borderBottomWidth: 1,

},
topbar: {
    flexDirection: 'row',
    backgroundColor: '#252525',
    paddingTop : 15,
},
trigger: {
    padding: 5,
    margin: 5,
},
triggerText: {
    color: 'white',
},
divider: {
    marginVertical: 5,
    marginHorizontal: 2,
    borderBottomWidth: 2,
    borderColor: '#ccc',
},
slideInOption: {
    padding: 5,
},
text: {
    fontSize: 15,
    color: 'white',
},
wraper: {
    backgroundColor:'#252525',
    opacity: 0.8,
    padding: 5
},
});

export default PopUpMenu;