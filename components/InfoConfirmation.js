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
  TouchableOpacity, AsyncStorage, TextInput, Modal, NativeModules
} from 'react-native';
import {Actions, Scene} from 'react-native-mobx';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EStyleSheet from 'react-native-extended-stylesheet';
import THEME from '../assets/theme';
import { Col, Row, Grid } from "react-native-easy-grid";
import {observable} from "mobx";
import {observer, inject} from 'mobx-react/native';
import moment from 'moment';
import 'moment/locale/vi';
import BusLoading from '../components/widgets/BusLoading';
import stringres from '../assets/string';
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
    position: 'relative'
  },
  content: {
    width:'90%',
    height: '70%',
    alignSelf: 'center',
    flex:2
  },
  infoContainer: {
    borderBottomWidth: 0.5,
    borderColor:'lightgrey',
    marginLeft: 10,
    marginRight:10,
    marginTop:10,
  },
  textLabelNormal: {
    color:'darkgrey',
    fontSize: '12rem',
    textAlign:'left',
    lineHeight:Math.round('$rem*12'),
  },
  textLabelSmall: {
    color:'darkgrey',
    fontSize: '10rem',
    lineHeight:Math.round('$rem*10'),
    textAlign:'left'
  },
  textNormal: {
    fontSize:'12rem',
    color:'grey',
    lineHeight:Math.round('$rem*12'),
  },
  textBoldSmall: {
    fontWeight:'bold',
    color: 'dimgrey',
    fontSize: '12rem',
    lineHeight:Math.round('$rem*12'),
  },
  textBoldLarge: {
    fontWeight:'bold',
    color: 'dimgrey',
    fontSize: '14rem',
    lineHeight:Math.round('$rem*14'),
  },
  titlePage: {
    alignSelf:'center',
    textAlign:'center',
    alignItems: 'center',
    color:'white',
    fontWeight:'bold',
    width: (Platform.OS === 'ios' ) ? '80%' : '75%',
  },
  bottomContainer: {
    flex:0,
    marginTop:'5rem',
    marginBottom:'40rem'
  },
  backArrow:{
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginLeft: '-10rem',
    marginRight: '12rem',
  },
  popupCard: {
    alignSelf:'center',
    height: '20%',
    width: '60%',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:'white',
    padding:'10rem'
  },
  busLoadingContainer: {
    flex:1,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    marginTop:h*0.030,
    width:'100%'
  },
  totalPrice: {
    color:'orange',
    fontStyle:'italic',
    fontWeight:'bold',
    fontSize:'14rem',
    marginLeft:'3rem',
    lineHeight:Math.round('$rem*14')
  },
  infoContainerRow: {
    flexDirection: 'row',
    alignItems:'center',
    marginBottom:'5rem'
  },
  infoContainerRouteDetailRow: {
    flexDirection: 'row',
    alignItems:'center',
    marginBottom:'8rem'
  },
  infoContainerLastRow: {
    flexDirection: 'row',
    marginBottom:'8rem',
  }
});

const MK = require('react-native-material-kit');
const {
  MKButton,
  MKColor,
  MKTextField,
  mdl,
} = MK;
let VexereModule = NativeModules.VexereModule;
let numeral = require('numeral');
const {height:h, width:w} = Dimensions.get('window');

@inject("appStore")
@observer
export default class InfoConfirmation extends Component {
  state = {
    isLoading : false
  };

  onSubmit = async () => {
    try {
      await VexereModule.payTicket(
        JSON.stringify(this.props.customerInfo),
        JSON.stringify(this.props.bookedItem),
        this.props.bookedItem.trip_id,
        this.props.customerInfo.payment_amount.toString()
      );
    } catch (e) {
      console.log(e);
    };
  };

  render() {
    const store = this.props.store;
    const appStore = this.props.appStore;

    let route = this.props.bookedItem;
    let momentObj = moment(route.departure_time, 'HH:mm');
    momentObj.add(route.duration,'minutes');
    let arriveTime = momentObj.format('HH:mm');

    let bookingDateMomentObj = moment(this.props.appStore.bookingDate, 'ddd, DD/MM/YYYY');
    bookingDateMomentObj.locale('vi');
    let momentBookingDateString = bookingDateMomentObj.format('DD/MM/YYYY');
    let departureTime = route.departure_time + ' ' + momentBookingDateString;
    bookingDateMomentObj = moment(departureTime, 'HH:mm DD/MM/YYYY');
    bookingDateMomentObj.add(route.duration,'minutes');
    let arriveDate = bookingDateMomentObj.format('DD/MM/YYYY');
    let seat = "";
    if (route.booking_type == 1) {
        let seats_name = "";
        seat = this.props.customerInfo.seats.length + ' ' + stringres.value.t('vxr_selected_seat_count', {count: this.props.customerInfo.seats.length}) + ' ('
        for (let i = 0; i < this.props.customerInfo.seats.length; i++) {
          if (i < this.props.customerInfo.seats.length - 1) {
            seats_name+= this.props.customerInfo.seats[i].seat_code;
            seats_name+= " ,";
          } else {
            seats_name+= this.props.customerInfo.seats[i].seat_code;
          }
        }
        seat = seat + seats_name + ")";
      } else {
        seat = this.props.customerInfo.seats + ' ' + stringres.value.t('vxr_selected_seat_count', {count: parseInt(this.props.customerInfo.seats)});
      }


      const departure = route.departure ? <Text style={styles.textBoldSmall}>
        {route.departure}
      </Text> : null;

      const destination = route.destination ? <Text style={styles.textBoldSmall}>
        {route.destination}
      </Text> : null;
    /*===============================Init widgets===============================*/
    const FlatButton = MKButton.flatButton()
      .withBackgroundColor(THEME.mainBlue)
      .withText(stringres.value.t('vxr_buy_ticket'))
      .withTextStyle({
          color: 'white',
          fontWeight: 'bold',
        })
      .withStyle({
        width: w*0.90,
        alignSelf:'center',
        marginTop: 10,
      })
      .withOnPress(() => {
        this.setState({isLoading : false});
        this.onSubmit().then(() => this.setState({isLoading : true}))})
      .build();
      return  (
        <View>

            <View style={styles.navbar}>
              <Button
                style={styles.backArrow} transparent onPress={() => {Actions.pop()}}>
                <Ionicons name={THEME.backIcon} size={25} style={{color:'white'}}/>
              </Button>
              <Text style={styles.titlePage}>{stringres.value.t('vxr_confirmation')}</Text>
            </View>


            <View style={{flex:1}}>
              <Content style={styles.content}>
                <View style={styles.infoContainer}>

                  <View style={styles.infoContainerRouteDetailRow}>
                    <Text style={[styles.textLabelNormal,{flex:3}]}>
                      {stringres.value.t('vxr_route_title')}
                    </Text>
                    <Text style={[styles.textBoldSmall,{flex:7}]}>
                      {this.props.bookedItem.from} - {this.props.bookedItem.to}
                    </Text>
                  </View>

                  <View style={styles.infoContainerRouteDetailRow}>
                    <Text style={[styles.textLabelNormal,{flex:3}]}>
                      {stringres.value.t('vxr_departure_time')}
                    </Text>
                    <View style={{flexDirection:'row', flex:7}}>
                      <Text style={[styles.textBoldSmall,{marginRight:2}]}>
                        {this.props.bookedItem.departure_time}
                      </Text>
                      <Text style={styles.textNormal}>
                        - {momentBookingDateString}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.infoContainerRouteDetailRow}>
                      <Text style={[styles.textLabelNormal,{flex:3}]}>
                        {stringres.value.t('vxr_arrive_time')}
                      </Text>
                      <View style={{flexDirection:'row', flex:7}}>
                        <Text style={[styles.textBoldSmall,{marginRight:2}]}>
                          {arriveTime}
                        </Text>
                        <Text style={styles.textNormal}>
                          - {arriveDate}
                        </Text>
                      </View>
                  </View>

                  <View style={styles.infoContainerRouteDetailRow}>
                    <Text style={[styles.textLabelNormal,{flex:3}]}>
                      {stringres.value.t('vxr_provider')}
                    </Text>
                    <Text style={[styles.textBoldSmall,{flex:7}]}>
                      {route.company.name}
                    </Text>
                  </View>

                  <View style={[styles.infoContainerRouteDetailRow, {alignItems:'flex-start'}]}>
                    <Text style={[styles.textLabelNormal,{flex:3}]}>
                      {stringres.value.t('vxr_departure')}
                    </Text>
                    <View style={{flexDirection:'column', flex:7}}>
                      {departure}
                      <Text style={[styles.textNormal,{flexWrap:'wrap'}]}>
                        {route.departure_address}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.infoContainerLastRow}>
                    <Text style={[styles.textLabelNormal,{flex:3}]}>
                      {stringres.value.t('vxr_destination')}
                    </Text>
                    <View style={{flexDirection:'column', flex:7}}>
                      {destination}
                      <Text style={[styles.textNormal,{flexWrap:'wrap'}]}>
                        {route.destination_address}
                      </Text>
                    </View>
                  </View>

              </View>


              <View style={styles.infoContainer}>

                <View style={styles.infoContainerRow}>
                  <Text style={[styles.textLabelSmall,{flex:3}]}>
                    {stringres.value.t('vxr_customer_name')}
                  </Text>
                  <Text style={[styles.textBoldLarge,{flex:7}]}>
                    {this.props.customerInfo.cus_name}
                  </Text>
                </View>

                <View style={styles.infoContainerRow}>
                  <Text style={[styles.textLabelSmall,{flex:3}]}>
                    {stringres.value.t('vxr_mobile')}
                  </Text>
                  <Text style={[styles.textBoldLarge,{flex:7}]}>
                    {this.props.customerInfo.cus_phone}
                  </Text>
                </View>

                <View style={styles.infoContainerRow}>
                  <Text style={[styles.textLabelSmall,{flex:3}]}>
                    {stringres.value.t('vxr_email')}
                  </Text>
                  <Text style={[styles.textBoldLarge,{flex:7}]}>
                    {this.props.customerInfo.cus_email}
                  </Text>
                </View>

                <View style={styles.infoContainerRow}>
                  <Text style={[styles.textLabelSmall,{flex:3}]}>
                    {stringres.value.t('vxr_booked_seat')}
                  </Text>
                  <Text style={[styles.textBoldLarge,{flex:7}]}>
                    {seat}
                  </Text>
                </View>

                <View style={styles.infoContainerLastRow}>
                  <Text style={[styles.textLabelSmall,{flex:3, marginTop:2}]}>
                    {stringres.value.t('vxr_pickup_address')}
                  </Text>
                  <Text style={[styles.textNormal,{flexWrap:'wrap', flex: 7}]}>
                    {this.props.customerInfo.pick_up}
                  </Text>
                </View>
            </View>
            <View style={[styles.infoContainer,{borderBottomWidth: 0, alignItems:'center'}]}>
              <View style={{flexDirection: 'row', alignItems:'center'}}>
                <Text style={[styles.textLabelSmall,{flex:3}]}>
                  {stringres.value.t('vxr_total')}
                </Text>
                <View style={{flexDirection:'row', flex:7, alignItems:'center'}}>
                  <Text
                    style={styles.totalPrice}>
                    {numeral(this.props.customerInfo.payment_amount).format('0,0')}đ
                  </Text>
                </View>
              </View>
            </View>
      </Content>
      <View style={styles.bottomContainer}>
        <FlatButton/>
      </View>
    </View>

    <Modal
      animationType={"fade"}
      transparent={true}
      visible={this.state.isLoading}
      onRequestClose={() => this.setState({isLoading : false})}
      >
      <View style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        top:0,
        bottom:0,
        left:0,
        right:0,
        position:'absolute'
      }}/>
        <View style={{
          flex: 1,
          justifyContent: 'center',
        }}>
          <View style={[styles.popupCard]}>
            <View style={styles.busLoadingContainer}>
              <BusLoading isLoading={this.state.isLoading}
               style={{justifyContent:'center', alignSelf:'center'}} />
            </View>
          </View>
        </View>
    </Modal>
  </View>
    )
  }
}
