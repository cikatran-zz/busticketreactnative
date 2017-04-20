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
  AppRegistry, StyleSheet, DatePickerAndroid, Platform, Dimensions, Image,
  TouchableOpacity, AsyncStorage, TextInput, Modal, findNodeHandle, NativeModules, InteractionManager
} from 'react-native';
import TextInputState from 'react-native/lib/TextInputState';
import {Actions, Scene} from 'react-native-mobx';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EStyleSheet from 'react-native-extended-stylesheet';
import THEME from '../assets/theme';
import { Col, Row, Grid } from "react-native-easy-grid";
import {observable} from "mobx";
import {observer, inject} from 'mobx-react/native';
import BusLoading from '../components/widgets/BusLoading';
import ErrorSign from '../components/widgets/ErrorSign';
import stringres from '../assets/string';
let VexereModule = NativeModules.VexereModule;
/* Style Config */
const styles = EStyleSheet.create({
  header: {
    backgroundColor: '$mainBlue',
  },
  navbar: {
    backgroundColor: '$mainBlue',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: (Platform.OS === 'ios' ) ? '15rem' : 0,
    height: '$toolbarHeight - 10',
    elevation: 3,
    shadowColor: '#ccc',
    shadowOffset: { width: 2, height: 2, },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    position: 'relative'
  },
  content: {
    width:'90%',
    height: '60%',
    alignSelf: 'center',
    flex:2
  },
  promotionText: {
    color: '$mainBlue',
    textAlign:'center',
    alignSelf:'center'
  },
  popupCard: {
    alignSelf:'center',
    height: '50%',
    position:'absolute',
    bottom:'30rem',
    right:'20rem',
    left:'20rem',
    borderRadius:10,
    backgroundColor:'white',
    padding:'10rem'
  },
  titlePage: {
    alignSelf:'center',
    textAlign:'center',
    alignItems: 'center',
    color:'white',
    fontWeight:'bold',
    width: (Platform.OS === 'ios' ) ? '80%' : '75%',
  },
  backArrow:{
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginLeft: '-10rem',
    marginRight: '12rem',
  },
  textField: {
    flexDirection:'row',
    width: '60%'
  },
  noteTextField: {
    marginTop:'10rem',
    width: '80%',
    height:'100rem',
    borderWidth:1,
    borderColor:'lightgrey',
    borderRadius:2,
    justifyContent:'flex-start',
    marginBottom:'5rem'
  },
  bottomContainer: {
    flex:0,
    alignItems:'flex-end',
    justifyContent:'flex-end',
    marginTop:'5rem',
    marginBottom:'80rem'
  },
  bottomImage: {
    height:'90rem',
    width: '90%',
    alignSelf:'center'
  },
  busLoadingContainer: {
    flex:1,
    flexDirection:'row',
    justifyContent:'center',
    marginTop:10,
    width:'100%'
  },
  textError: {
    color:'red',
    fontSize:10,
    alignItems:'flex-start',
    justifyContent: 'flex-start',
    alignSelf:'flex-start',
    lineHeight: Math.round('$rem*12'),
  },
  inputContainer: {
    flexDirection:'column',
    height:'50rem',
    width:'80%'
  },
  seatInputContainer: {
    flexDirection:'column',
    height:'50rem',
    width:'20%'
  },
  seatTextField: {
    flexDirection:'row',
    position:'absolute',
    justifyContent:'space-between',
    bottom:'20rem',
    alignItems:'center'
  },
  dropdownImage:{
    height:'5.5rem',
    width:'11rem',
    position:'absolute',
    right:'5rem',
    bottom: '25rem',
  },
  seatNumber: {
    color:'grey',
    textAlign:'center',
    justifyContent:'center',
    alignItems:'center',
    width:0.15*w,
    lineHeight: Math.round('$rem*12')
  }
});

const MK = require('react-native-material-kit');
const {
  MKButton,
  MKColor,
  MKTextField,
  mdl,
} = MK;
const {height:h, width:w} = Dimensions.get('window');
const UIManager = NativeModules.UIManager;
const USER_INFO = 'USER_INFO';

@inject("appStore")
@observer
export default class CustomerForm extends Component {

  state = {
    isFocused: false,
    cusName: '',
    cusPhone: '',
    cusEmail: '',
    noOfSeat: 0,
    note: '',
    pickupPoints: [],
    isLoading: true,
    error: false,
    errorText: '',
    emailInvalid: false,
    nameInvalid: false,
    phoneInvalid: false,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.loadUerInfo().done();
      //check pickup points available;
      if (this.props.bookedItem.booking_type == 1) {
        this.setState({pickupPoints: this.props.pickupPoints.slice()})
        this.setState({isLoading : false});
        this.setPickupLocation();
      } else {
        this.loadPickupPoints().then(() => {
          this.setState({isLoading : false});
          this.setPickupLocation();
        })
      }


      //Check available seats
      // if (this.props.bookedItem.total_available < 4) {
      //   this.props.store.setMaxSeat(this.props.bookedItem.total_available)
      // } else {
      //   this.props.store.setMaxSeat(4);
      // }
    });
  }

    setPickupLocation() {
      if (this.state.pickupPoints.length < 1) {
        this.props.appStore.setPickupLocation(this.props.bookedItem.departure_address);
      } else {
        this.props.appStore.setPickupLocation(this.state.pickupPoints[0].name);
        console.log("Pickup Points: "+JSON.stringify(this.state.pickupPoints));
      }
    }



    loadPickupPoints = async () => {
      this.setState({isLoading: true});
      try {
        let {seatResponse} = await VexereModule.loadSeat(this.props.bookedItem.trip_id);
        let seatSchema = JSON.parse(seatResponse);
        this.setState({pickupPoints: seatSchema.data.pickup_points.slice()});
        console.log("Seat Response: "+JSON.stringify(seatSchema.data));
      } catch ({code, message}) {
        console.log(message);
        this.setState({error: true, errorText: message})
      }
    }

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

  handleListItemPress = (item) => {
    let appStore = this.props.appStore;
    appStore.setPickupLocation(item.name);
    this.props.store.isShowPickupPopup(false);
  };

  onSubmit = async () => {
    try {
      let phone_number = this.state.cusPhone.replace("+","");
      let customerInfo = {
        cus_name:this.state.cusName,
        cus_phone:phone_number,
        cus_email:this.state.cusEmail,
        cus_note: this.state.note,
        cus_address: 'None',
        seats: this.props.bookedItem.booking_type == 1 ? this.props.selectedSeats : this.props.store.amountOfSeat.toString(),
        pick_up: this.props.appStore.pickupLocation,
        payment_amount: this.props.bookedItem.booking_type == 1 ? this.props.price :
          this.props.bookedItem.price.original * this.props.store.amountOfSeat,
      };
      console.log('Phone: ' +phone_number);
      VexereModule.saveUserInfo(phone_number, this.state.cusName, this.state.cusEmail);
      Actions.infoConfirmation({bookedItem: this.props.bookedItem, customerInfo: customerInfo});
    } catch (e) {
      console.log(e);
    };
  };
  focusNextField(node) {
    try {
      if(Platform.OS==='ios') {
        UIManager.focus(findNodeHandle(node));
      } else if(Platform.OS==='android'){
          UIManager.dispatchViewManagerCommand(
            findNodeHandle(node),
            UIManager.AndroidTextInput.Commands.focusTextInput,
            null);
      }
      console.log("TextInputState" + TextInputState);
      console.log("focus TextInput" + findNodeHandle(node));
    } catch(e) {
      console.log("Couldn't focus text input: ", e.message)
    }
  };

  loadUerInfo = async () => {
    try {
      let {cus_name, cus_phone, cus_email} = await VexereModule.getUserInfo();
      this.setState({
        cusName: cus_name,
        cusPhone: cus_phone,
        cusEmail: cus_email
      });

    } catch (e) {
      console.log(e);
    };
  };

  validateEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.setState({emailInvalid: !re.test(email)});
    console.log("Email valid: "+re.test(email));
    return re.test(email);
  }
    validateName(name) {
      let re = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ '.]{1,50}$/
      this.setState({nameInvalid: !re.test(name)});
      return re.test(name);
  }

  validatePhone(phone) {
    let re = /^[0-9]{10,12}$/;
    this.setState({phoneInvalid: !re.test(phone)});
    return re.test(phone);
  }


  render() {
    const store = this.props.store;
    const appStore = this.props.appStore;
    const state = this.state;
    let isValid = false;
    if (this.state.cusName && this.state.cusPhone && this.state.cusEmail) {
      isValid = true;
    } else {
      isValid = false;
    }

    let pickupLocation = this.props.appStore.pickupLocation;
    if (pickupLocation.length > 35) {
      pickupLocation = pickupLocation.substring(0, 33) + '...';
    }
    /*===============================Init widgets===============================*/
    const FlatButton = MKButton.flatButton()
      .withBackgroundColor(isValid ? THEME.mainBlue : 'lightgrey')
      .withTextStyle({
          color: 'white',
          fontWeight: 'bold',
        })
      .withEnabled(isValid)
      .withText(stringres.value.t('vxr_book_seat'))
      .withStyle({
        width: w*0.90,
        alignSelf:'center',
        marginTop: 10,
      })
      .withOnPress(() => {
        this.validateEmail(this.state.cusEmail);
        this.validateName(this.state.cusName);
        this.validatePhone(this.state.cusPhone);
        if (this.validateEmail(this.state.cusEmail)
            && this.validateName(this.state.cusName)
            && this.validatePhone(this.state.cusPhone))
          this.onSubmit().done()
      })
      .build();

      let items = ['Hồ Chí Minh', 'Buôn Mê Thuột', 'Nha Trang', 'Đà Lạt', 'Rạch Giá'];
      let refs = this.refs;
      const renderRow = (item) => (
        <ListItem button onPress={() => this.handleListItemPress(item)}>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <View style={{flexDirection:'column', alignSelf:'flex-start', flex: 5}}>
              <Text style={{fontSize:13}}>{item.name}</Text>
              <Text style={{color:'lightgrey', fontSize:10}}>{item.address}</Text>
            </View>
            <Text style={{alignSelf:'flex-end', fontWeight:'bold', fontSize:13, flex:1, textAlign:'right'}}>{item.time}</Text>
          </View>
        </ListItem>
      );
      const nameInput = <Input
        style={{color:'grey'}}
        returnKeyType = {"next"}
        placeholder={stringres.value.t('vxr_name')}
        blurOnSubmit={false}
        maxLength = {50}
        autoCapitalize='words'
        value={this.state.cusName}
        onSubmitEditing={() => {this.PhoneInput._root.focus();}}
        onChangeText={(text) => this.setState({cusName:text})}
        placeholderTextColor ='lightgrey' />

      const phoneInput = <Input
        style={{color:'grey'}}
        returnKeyType = {"next"}
        ref={(ref) => this.PhoneInput = ref}
        keyboardType={'numeric'}
        blurOnSubmit={false}
        maxLength = {12}
        value={this.state.cusPhone}
        onSubmitEditing={() => {this.EmailInput._root.focus()}}
        placeholder={stringres.value.t('vxr_mobile')}
        onChangeText={(text) => this.setState({cusPhone:text})}
        placeholderTextColor ='lightgrey' />

      const emailInput = <Input
        ref={(ref) => this.EmailInput = ref}
        keyboardType={'email-address'}
        style={{color:'grey'}}
        returnKeyType = {"next"}
        autoCapitalize='none'
        placeholder={stringres.value.t('vxr_email')}
        value={this.state.cusEmail}
        maxLength = {50}
        onChangeText={(text) => this.setState({cusEmail:text})}
        placeholderTextColor ='lightgrey' />;

      const seatField = this.props.bookedItem.booking_type == 1 ?
      <View style={styles.seatTextField}>
        <Text style={styles.seatNumber}>  {this.props.selectedSeats.length + ' ' + stringres.value.t('vxr_selected_seat_count',{count: this.props.selectedSeats.length})}</Text>
      </View> :
      <View style={styles.seatTextField}>
      <TouchableOpacity onPress={() => {
        store.chooseAmountSeat(0);
      }}>
        <MaterialIcons name="remove-circle" size={15} style={{color:store.isMin ? 'grey' : `${THEME.mainBlue}` }}/>
      </TouchableOpacity>
      <Text style={styles.seatNumber}>{store.amountOfSeat + ' ' + stringres.value.t('vxr_selected_seat_count',{count: store.amountOfSeat})}</Text>
      <TouchableOpacity onPress={() => {
        store.chooseAmountSeat(1);
      }}>
        <MaterialIcons name="add-circle" size={15} style={{color:store.isMax ? 'grey' : `${THEME.mainBlue}` }}/>
      </TouchableOpacity>
      </View>

      const invalidEmailError = this.state.emailInvalid ? <Text style={styles.textError}> {stringres.value.t('vxr_error_invalid_email')}</Text> : <View />;
      const invalidNameError = this.state.nameInvalid ? <Text style={styles.textError}> {stringres.value.t('vxr_error_invalid_name')}</Text> : <View />;
      const invalidPhoneError = this.state.phoneInvalid ? <Text style={styles.textError}> {stringres.value.t('vxr_error_invalid_phone')}</Text> : <View />;
    return (
      <View>
          <View style={styles.navbar}>
            <Button
              style={styles.backArrow} transparent onPress={() => {Actions.pop()}}>
              <Ionicons name={THEME.backIcon} size={25} style={{color:'white'}}/>
              </Button>
              <Text style={styles.titlePage}>{stringres.value.t('vxr_customerform_title')}</Text>
          </View>
          {this.state.isLoading ?
          <View style={styles.busLoadingContainer}>
            <BusLoading
              isLoading={this.state.isLoading}
              style={{justifyContent:'center', alignSelf:'center'}} />
          </View> : this.state.error ? <ErrorSign error={this.state.errorText} /> :
          <View style={{flex:1}}>
          <Content style={styles.content}>
          {/*===============Render Input fields======================*/}
          <View style={{flexDirection:'column', marginTop:10}}>
            <View style={{flexDirection:'row', marginBottom:5}}>
              <View style={{width: 30,height:16, alignSelf:'flex-end', marginBottom:15} }>
                <Image style={{height: 15.5, width: 13}} source={require('../assets/images/person-ico.png')}/>
              </View>
              <View style={styles.inputContainer}>
                <InputGroup borderType='underline' >
                  {nameInput}
                </InputGroup>
                {invalidNameError}
              </View>
            </View>
            <View style={{flexDirection:'row', marginBottom:5}}>
              <View style={{width: 30,height:16, alignSelf:'flex-end', marginBottom:15} }>
                <Image style={{height: 15.5, width: 16}} source={require('../assets/images/phone-ico.png')}/>
              </View>
              <View style={styles.inputContainer}>
                <InputGroup borderType='underline' >
                  {phoneInput}
                </InputGroup>
                {invalidPhoneError}
              </View>
            </View>
            <View style={{flexDirection:'row', marginBottom:5}}>
              <View style={{width: 30,height:16, alignSelf:'flex-end', marginBottom:15} }>
                <Image style={{height: 12, width: 16}} source={require('../assets/images/mail-ico.png')}/>
              </View>
              <View style={styles.inputContainer}>
                <InputGroup borderType='underline' >
                  {emailInput}
                </InputGroup>
                {invalidEmailError}
              </View>
            </View>
            <View style={{flexDirection:'row', marginBottom:5}}>
              <View style={{width: 30,height:19, alignSelf:'flex-end', marginBottom:15}}>
                <Image style={{height: 18, width: 15}} source={require('../assets/images/destination-ico.png')}/>
              </View>
              <View style={{height:50}}>
                <TouchableOpacity style={{height:50}} onPress={() => store.isShowPickupPopup(this.state.pickupPoints.length > 0)}>
                  <View
                    ref={component => this._root = component}
                    style={styles.inputContainer}
                    pointerEvents={this.state.isFocused ? 'auto' : 'none'}>
                      <InputGroup borderType='underline' >
                        <Input
                          style={{color:'grey', width: 0.74*w}}
                          placeholder={stringres.value.t('vxr_select_pickup_address')}
                          placeholderTextColor ='lightgrey'
                          maxLength={36}
                          autoCorrect={false}
                          numberOfLines={1}
                          ellipsizeMode='tail'
                          value={pickupLocation}
                          />
                      </InputGroup>
                      <Image style={styles.dropdownImage} source={require('../assets/images/dropdown-grey-ico.png')} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{flexDirection:'row', marginBottom:5, width:105}}>
                <View style={{width: 30,height:19, alignSelf:'flex-end', marginBottom:25}}>
                  <Image style={{height: 18, width: 16}} source={require('../assets/images/seat-ico.png')}/>
                </View>
                <View style={styles.seatInputContainer}>
                  <InputGroup disabled={true} borderType='underline' >
                    <Input />
                  </InputGroup>
                  {seatField}
                </View>
              </View>
            </View>
          {/*============================================================*/}
          </Content>
          <View style={styles.bottomContainer}>
            <Image style={styles.bottomImage} source={require('../assets/images/main-background.png')}/>
            <FlatButton/>
          </View>
          </View>}

          <Modal
            animationType={"fade"}
            transparent={true}
            visible={store.showPickupPopup}
            onRequestClose={() => {this.props.store.isShowPickupPopup(false);}}
            >
            <TouchableOpacity style={{top:0,
              bottom:0,
              left:0,
              right:0,
              position:'absolute'}} onPress={() => {this.props.store.isShowPickupPopup(false);}}>
            <View style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              top:0,
              bottom:0,
              left:0,
              right:0,
              position:'absolute'
            }}/>
              </TouchableOpacity>
            <View style={styles.popupCard}>
            <List
              tabLabel = 'my-location'
              dataArray = {this.state.pickupPoints}
              renderRow = {renderRow}
            />
            </View>
          </Modal>
    </View>
        )
  }
}
