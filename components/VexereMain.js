'use strict';
import React, {Component} from 'react';
import {
  Header, Container, Footer,
  Text, View,
  Title, Content, List,
  ListItem, Icon,
  Card, CardItem, Thumbnail, Button,
  InputGroup, Input
} from 'native-base';
import {
  AppRegistry, StyleSheet,
  DatePickerAndroid, Platform,
  Dimensions, Image,
  TouchableOpacity, AsyncStorage,
  BackAndroid, DatePickerIOS,
  Modal, InteractionManager,
  PixelRatio, NativeModules
} from 'react-native';
import {Actions, Scene} from 'react-native-mobx';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import 'moment/locale/vi';
import EStyleSheet from 'react-native-extended-stylesheet';
import THEME from '../assets/theme';
import stringres from '../assets/string';
import { Col, Row, Grid } from "react-native-easy-grid";
import {observable} from "mobx";
import {observer, inject} from 'mobx-react/native'

let VexereModule = NativeModules.VexereModule;
const LOCATION_KEY = 'LOCATION_HISTORY';
const {height:h, width:w} = Dimensions.get('window');
let history =[];


/* Style Config */
const styles = EStyleSheet.create({
  navbar: {
  backgroundColor: '$mainBlue',
  justifyContent: 'space-between',
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 15,
  paddingTop: (Platform.OS === 'ios' ) ? 15 : 0,
  shadowColor: '#000',
  shadowOffset: {width: 0, height: 2},
  shadowOpacity: 0.1,
  shadowRadius: 1.5,
  height: '$toolbarHeight',
  elevation: 3,
  position: 'relative'
},
  headerImage: {
    alignSelf:'center',
  },
  content: {
    width:w*0.90,
    height: '30%',
    alignSelf: 'center',
    flex:3
  },
  historyText: {
    color: '$mainBlue',
    fontSize: '16rem',
  },
  flatButton: {
    width: w*0.90,
    height: '30rem',
    alignSelf:'center',
    marginTop: '10rem',
    justifyContent:'center',
    alignItems:'center'
  },
  bottomImage: {
    height:'90rem',
    width: w*0.90,
    alignSelf:'center'
  },
  bottomContainer: {
    flex:0,
    alignItems:'flex-end',
    justifyContent:'flex-end',
    marginBottom:'80rem'
  },
  backButton: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginLeft: '-10rem',
    marginRight: '12rem',
  },
  historyContainer: {
    alignSelf:'center',
    flexDirection:'column',
    marginTop:'50rem'
  },
  historyRow: {
    alignSelf:'center',
    marginBottom:'10rem',
    flexDirection:'row',
    width:'320rem'},
  iosDatePickerContainer: {
    position:'absolute',
    left: 0,
    right:0,
    top: h*0.55,
    height: h*0.45,
    backgroundColor:'white'
  },
  iosDatePickerDoneButton: {
    position:'absolute',
    right: '30rem',
    top: '10rem'
  },
  datePickerIOS: {marginTop:'50rem'},
  navRightBtn: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    alignSelf:'center',
    flexDirection: 'row',
    marginRight: '-15rem',
  }
});

const MK = require('react-native-material-kit');
const {
  MKButton,
  MKColor,
  MKTextField,
  mdl,
} = MK;

let self = this;

@inject("appStore")
@observer
class VexereMain extends Component {

  componentDidMount() {
      this.loadFromHistory().done();
      moment.locale(VexereModule.locale);
    }

  setNativeProps (nativeProps) {
    this._root.setNativeProps(nativeProps);
  }

  state = {
    minDate: '',
    willShowIOSDatePicker : false,
    isFocused: false,
  };
  /*====================Show Date Picker functions=====================*/

  showAndroidDatePicker = async (stateKey, options) => {
    console.log(options);
     try {

       if (options.date == '') {
         options.date = new Date();
       } else {
         let momentObj = moment(options.date, 'ddd, DD/MM/YYYY');
         momentObj.locale(VexereModule.locale);
         let momentDateString = momentObj.format('YYYY-MM-DD');
         console.log(momentDateString);
         let parts = momentDateString.match(/(\d+)/g);
         console.log(parts);
         options.date = new Date(parts[0], parts[1]-1, parts[2]);
       }
       console.log(options.date);
       const {action, year, month, day} = await DatePickerAndroid.open(options);
       if (action === DatePickerAndroid.dismissedAction) {

       } else {
         let date = new Date(year, month, day);
         let currentDate = new Date();
         if (date < currentDate)
          date = currentDate;
         this.props.appStore.setBookingDate(moment(date).format('ddd, DD/MM/YYYY'));
       }

     } catch ({code, message}) {
       console.warn(`Error in example '${stateKey}': `, message);
     }
   };

  showDatePicker = () => {
    let aStore = this.props.appStore;
    if (Platform.OS === 'android') {
      this.showAndroidDatePicker('min', {
        date : aStore.bookingDate,
        minDate : new Date()
      });
    } else {
       this.showIOSDatePicker(true);
    }

  };

  showIOSDatePicker = (isShown) => {
    this.props.store.setShownIOSDatePicker(isShown);
    if (this.props.appStore.bookingDate == '')
      this.props.appStore.setBookingDate(moment(new Date()).format('ddd, DD/MM/YYYY'));
  };

  onIOSDateChanged = (date) => {

    this.props.appStore.setBookingDate(moment(date).format('ddd, DD/MM/YYYY'))
  };

  changeDate = () => {
    this.setState({minDate:dateChanged});
  }

  /*==========================================================================*/

  /*=====================Make text fields clickable===========================*/

  _handleFocus() {
      if (!this.state.isFocused) {
        this.setState({isFocused: true});
        requestAnimationFrame(() => {
          this._textInput.focus();
        });
      }
    }

    _handleBlur() {
      this.setState({isFocused: false});
    }

  /*==========================================================================*/

    goSearchLocation(type) {
      this.props.appStore.setTypeOfLocation(type);
      Actions.searchLocation();
    }

    changeDirection = () => {
      let start = this.props.appStore.startLocation;
      let stop = this.props.appStore.stopLocation;
      this.props.appStore.setStartLocation(stop);
      this.props.appStore.setStopLocation(start);
    }

    loadFromHistory = async () => {
      try {
        history = await AsyncStorage.getItem(LOCATION_KEY);
        if (history === '[{}]' || history == null) {
          history = [];
        } else {
          history = JSON.parse(history);
        }
        this.props.store.setHistory(history);

      } catch (e) {
        console.log(e);
      };
    };

    onSubmit = async () => {
      let isExist = false;
      try {
        let item = {start:this.props.appStore.startLocation, stop:this.props.appStore.stopLocation};

        for (let i = 0; i < history.length; i++) {
          if (history[i].start.code === item.start.code && history[i].stop.code === item.stop.code) {
            isExist = true;
            break;
          }
        }
        if (!isExist) {
          if (history.length >4) {
            history.pop();
          };
          history.unshift(item);
        }

        this.props.store.setHistory(history);
        AsyncStorage.setItem(LOCATION_KEY, JSON.stringify(history));
        Actions.bookingScreen();
      } catch (e) {
        console.log(e);
      };
    };



  /* Render View */
  render() {
    let showMaskIOS = this.props.store.isShownIOSDatePicker ? <View style={{
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      top:0,
      bottom:0,
      left:0,
      right:0,
      position:'absolute'
    }}/> : null;
    let bookingDate = this.props.appStore.bookingDate;
    if (bookingDate == '') {
      bookingDate = new Date();
    } else {
      let momentObj = moment(bookingDate, 'ddd, DD/MM/YYYY');
      momentObj.locale(VexereModule.locale);
      let momentDateString = momentObj.format('YYYY-MM-DD');
      console.log(momentDateString);
      let parts = momentDateString.match(/(\d+)/g);
      console.log(parts);
      bookingDate = new Date(parts[0], parts[1]-1, parts[2]);
    }
    const store = this.props.store;
    const isValid = Object.keys(this.props.appStore.startLocation).length > 0
                    && Object.keys(this.props.appStore.stopLocation).length > 0
                    && this.props.appStore.bookingDate !== '';
  /*===============================Init widgets===============================*/
    const FlatButton = MKButton.flatButton()
      .withBackgroundColor(isValid ? THEME.mainBlue : 'lightgrey')
      .withText(stringres.value.t('vxr_book_ticket'))
      .withTextStyle({
          color: 'white',
          fontWeight: 'bold',
        })
      .withEnabled(isValid)
      .withOnPress(() => this.onSubmit().done())
      .build();
  /*==========================================================================*/
    let rows = [];
    console.log('history length: '+store.history.length);
    if (store.history.length > 0) {
      for (let i = 0; i < store.history.length; i++) {
        rows.push(
          <TouchableOpacity key={i} onPress={() => {
            this.props.appStore.setStartLocation(store.history[i].start);
            this.props.appStore.setStopLocation(store.history[i].stop);
          }}>
              <View style={styles.historyRow}>
                  <Col style={{ alignSelf:'center'}}>
                    <Text style={[styles.historyText,{textAlign:'right'}]}>{store.history[i].start.name}</Text>
                  </Col>
                  <Col style={{width:30, alignSelf:'center', margin: 5}}>
                    <Image style={{height:10, width:25}} source={require('../assets/images/direction-ico.png')}/>
                  </Col>
                  <Col style={{ alignSelf:'center'}}>
                    <Text style={styles.historyText}>{store.history[i].stop.name}</Text>
                  </Col>
              </View>
          </TouchableOpacity>
        );
      }
    }
    let renderHistoryLocations = rows;

    return (
      <Container>
        <View style={styles.navbar}>
          <Button
            style={styles.backButton} transparent onPress={() => {VexereModule.exitReactNative()}}>
            <Ionicons name={THEME.backIcon} size={25} style={{color:'white'}}/>
          </Button>
          <Image style={styles.headerImage} source={require('../assets/images/vexere-ico.png')} />
          <Button
            style={styles.navRightBtn} transparent
            onPress={() => {Actions.informationWebview()}}>
            <MaterialIcons name="info-outline" size={25} style={{color:'white'}}/>
          </Button>
        </View>
        <View style={{flex:1}}>
        <Content style={styles.content}>

        {/*===============Render Input fields======================*/}
        <View style={{flexDirection:'column', marginTop:10}}>
          <Grid style={{marginBottom:5}}>
            <Col style={{width: 30,height:16, alignSelf:'flex-end', marginBottom:15} }>
              <Image style={{height: 16, width: 16}} source={require('../assets/images/start-ico.png')}/>
            </Col>
            <Col style={{height:50}}>
              <TouchableOpacity style={{height:50}} onPress={() => this.goSearchLocation(0)}>
                <View
                  ref={component => this._root = component}
                  style={{height:50}}
                  pointerEvents={this.state.isFocused ? 'auto' : 'none'}>
                  <InputGroup borderType='underline' >
                    <Input
                      style={{color:'grey'}}
                      placeholder={stringres.value.t('vxr_departure')}
                      value={this.props.appStore.startLocation.name}
                      placeholderTextColor ='lightgrey' />
                  </InputGroup>
                </View>
              </TouchableOpacity>
            </Col>
          </Grid>
          <Grid style={{marginBottom:5}}>
            <Col style={{width: 30,height:19, alignSelf:'flex-end', marginBottom:15}}>
              <Image style={{height: 18, width: 15}} source={require('../assets/images/destination-ico.png')}/>
            </Col>
            <Col style={{height:50}}>
              <TouchableOpacity style={{height:50}} onPress={() => this.goSearchLocation(1)}>
                <View
                  ref={component => this._root = component}
                  style={{height:50}}
                  pointerEvents={this.state.isFocused ? 'auto' : 'none'}>
                  <InputGroup borderType='underline' >
                    <Input
                      style={{color:'grey'}}
                      placeholder={stringres.value.t('vxr_destination')}
                      value={this.props.appStore.stopLocation.name}
                      placeholderTextColor ='lightgrey' />
                  </InputGroup>
                </View>
              </TouchableOpacity>
            </Col>
          </Grid>
          <Grid>
            <Col style={{width: 30,height:19, alignSelf:'flex-end', marginBottom:15}}>
              <Image style={{height: 18, width: 18}} source={require('../assets/images/calendar-ico.png')}/>
            </Col>
            <Col style={{height:50}}>
              <TouchableOpacity style={{height:50}} onPress={this.showDatePicker}>
                <View
                  ref={component => this._root = component}
                  style={{height:50}}
                  pointerEvents={this.state.isFocused ? 'auto' : 'none'}>
                  <InputGroup borderType='underline' >
                    <Input
                      style={{color:'grey'}}
                      placeholder={stringres.value.t('vxr_departure_date')}
                      value={this.props.appStore.bookingDate}
                      placeholderTextColor ='lightgrey' />
                  </InputGroup>
                </View>
              </TouchableOpacity >
            </Col>
          </Grid>
          </View>

          <Image style={{
            height: 23,
            width: 3,
            zIndex: 10,
            position: 'absolute',
            top: 53,
            left: 6,
          }} source={require('../assets/images/ellipse-ico.png')}/>

          <TouchableOpacity style={{
            height:25,
            zIndex: 10,
            position: 'absolute',
            top: 65,
            right: 6,
          }} onPress={this.changeDirection}>
            <Image style={{
              height: 25,
              width: 25,
            }} source={require('../assets/images/change-direction-ico.png')}/>
          </TouchableOpacity>
        {/*============================================================*/}

        {/*===============Render History Locations=====================*/}
        <View style={styles.historyContainer}>
          {renderHistoryLocations}
        </View>
        {/*============================================================*/}

        </Content>
        <View style={styles.bottomContainer}>
          <Image style={styles.bottomImage} source={require('../assets/images/main-background.png')}/>
          <FlatButton style={styles.flatButton} />

        </View>
          {showMaskIOS}
          <Modal
            transparent={true}
            animationType={"slide"}
            visible={this.props.store.isShownIOSDatePicker}
            onRequestClose={() => {this.props.store.setShownIOSDatePicker(false)}}
            >
            <View style={styles.iosDatePickerContainer}>
              <Button
                transparent
                style={styles.iosDatePickerDoneButton}
                textStyle={{color:'#1D62F0'}}
                onPress={() => {
                  this.props.store.setShownIOSDatePicker(false)
                }}
                >
                Done
              </Button>
              <DatePickerIOS
                style={styles.datePickerIOS}
                date={bookingDate}
                mode="date"
                minimumDate= {new Date()}
                onDateChange={this.onIOSDateChanged}
              />
            </View>
          </Modal>
        </View>
      </Container>
    )
  }
}
export default VexereMain
