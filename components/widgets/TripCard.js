import React, { Component } from 'react';
import {
  BackAndroid, Platform,
  TextInput, Image,
  TouchableOpacity, DatePickerAndroid,
  Dimensions, PixelRatio
} from 'react-native';
import {
  Container, Header,
  InputGroup, Input,
  Card, CardItem,
  Icon, Button, View, Grid,
  Col, Row,
  List, ListItem, Text } from 'native-base';
import { Actions } from 'react-native-mobx';
import { MKRadioButton, setTheme, getTheme } from 'react-native-material-kit';
import EStyleSheet from 'react-native-extended-stylesheet';
import THEME from '../../assets/theme';
import {observer} from 'mobx-react/native';
import moment from 'moment';
import stringres from '../../assets/string';

let numeral = require('numeral');
const theme = getTheme();
const {height:h, width:w} = Dimensions.get('window');
const styles = EStyleSheet.create({
  textTime: {
    fontWeight: 'bold',
  },
  textSmall: {
    color:'silver',
    fontSize: '10rem',
    lineHeight:Math.round('$rem*10'),
  },
  textExtraSmall: {
    color:'silver',
    fontSize: '8rem',
  },
  textBusBranch: {
    color: '$mainBlue',
    fontSize: '13rem',
    lineHeight:Math.round('$rem*13'),
    fontWeight:'bold',
    alignSelf: 'center',
    maxWidth: w*0.30,
  },
  textPromotion: {
    color:'red',
    fontSize: '9rem',
    lineHeight: 9,
    fontWeight: 'bold',
    textAlign:'center',
    marginLeft:'2rem',
    top: 0,
  },
  textOldPrice: {
    color:'lightgrey',
    fontSize:'10rem',
    textAlign:'right',
    textDecorationLine:'line-through',
    lineHeight:12
  },
  textNewPrice: {
    color: 'orange',
    textAlign:'right',
    fontWeight:'bold',
    fontStyle:'italic',
    fontSize:'12rem',
    lineHeight:Math.round('$rem*12'),
    alignItems:'center'
  },
  imagePromotion: {
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
    resizeMode: 'contain'
  },
  cardStyle: {
    elevation:1,
    height: '140rem',
    padding: '10rem',
    justifyContent:'space-between'
  },
  startContainer: {
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
  },
  busDetailsContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    borderBottomWidth: 0.5,
    borderColor:'lightgrey',
    alignItems:'center',
    paddingBottom:'10rem'
  },
  starImage: {
    width: '11rem',
    height: '11rem',
    marginRight:'2rem',
    alignSelf:'center'
  },
  bookingBtn: {
    width:w*0.30,
    height: '25rem',
    borderColor: `${THEME.mainBlue}`
  },
  bookingBtnText: {
    color: `${THEME.mainBlue}`,
    alignSelf:'center',
    justifyContent:'center',
    fontSize:'12rem',
    lineHeight:Math.round('$rem*12'),
  },
  priceContainer:{
    flexDirection:'column',
    alignSelf:'center',
    justifyContent:'center',
    width:w*0.25,
  },
  textVehicle: {
    textAlign:'right',
    alignSelf:'center',
    alignItems:'center',
    textAlignVertical:'center',
    lineHeight:Math.round('$rem*8'),
    color:'silver',
    fontSize: '8rem',
  },
  directionArrowContainer: {
    flexDirection:'column',
    width:'80rem',
    marginTop:'5rem',
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'flex-start'
  },
  destinationContainer: {
    flexDirection:'column',
    width:'100rem'
  },
  departureContainer: {
    flexDirection:'column',
    width:'60rem'
  },
  directionArrowImg: {
    width: '59rem',
    height: '6rem'
  }
});
@observer
export default class TripCard extends Component {
  propTypes: {
    item: React.PropTypes.object;
    store: React.PropTypes.object;
    index: React.PropTypes.number;
  }

  renderRating (rating) {
    let star = [];
    rating = Math.round(rating);
    for (let i = 0; i < rating; i++) {
      star.push(
        <Image key={i} style={styles.starImage} source={require('../../assets/images/star-orange-ico.png')}/>
      );
    }
    return star;
  }
  render () {
    let route = this.props.item;
    const duration = Math.floor(route.duration / 60) + "h" + (route.duration % 60) +"m";
    let momentObj = moment(route.departure_time, 'HH:mm');
    momentObj.add(route.duration,'minutes');
    let arriveTime = momentObj.format('HH:mm');
    const bookingBtnTitle = this.props.item.booking_type == 1 ? stringres.value.t('vxr_select_seat') : stringres.value.t('vxr_book_ticket');
    const showStar = route.company.ratings.overall > 0 ? <TouchableOpacity
      style={{justifyContent:'center',
      alignItems:'center',
      alignSelf:'center',}}
      onPress={() => {
        this.props.store.setRatingShow(true);
        this.props.store.setRatingIndex(this.props.index);
      }}
      >
      <View style={styles.startContainer}>
        {this.renderRating(route.company.ratings.overall)}
        <Text style={[styles.textSmall, {alignSelf:'center'}]}> {stringres.value.t('vxr_reviews_count', {count: route.company.ratings.comments})} </Text>
      </View>
    </TouchableOpacity> : <View/>
    let showWifiIcon = route.facilities.wifi ? <Image style={{width: 24, height: 17, marginRight: 5}} source={require('../../assets/images/wifi-ico.png')}/> : null;
    let showTVIcon = route.facilities.dvd ? <Image style={{width: 22, height: 18, marginRight: 5}} source={require('../../assets/images/tv-ico.png')}/> : null;
    let showAirConIcon = route.facilities.aircon ? <Image style={{width: 23, height: 18}} source={require('../../assets/images/air-condition-ico.png')}/> : null;
    return (
    <ListItem style={{borderBottomWidth: 0}}>
      <View style={[theme.cardStyle, styles.cardStyle]}>
            <View style={{flexDirection:'row'}}>
              <View style={styles.departureContainer}>
                <Text style={styles.textTime}> {route.departure_time} </Text>
                <Text style={styles.textSmall}
                  numberOfLines={1}
                  ellipsizeMode ='tail'> {route.departure} </Text>
              </View>
              <View style={styles.directionArrowContainer}>
                <Text style={[styles.textExtraSmall, {lineHeight: 10}]}> {duration} </Text>
                <Image style={styles.directionArrowImg} source={require('../../assets/images/direction-arrow.png')}/>
              </View>
              <View style={styles.destinationContainer}>
                <Text style={styles.textTime}> {arriveTime} </Text>
                <Text style={styles.textSmall}
                  numberOfLines={1}
                  ellipsizeMode ='tail'> {route.destination} </Text>
              </View>
            </View>
            <View style={styles.busDetailsContainer}>
                <Text style={styles.textBusBranch}
                      numberOfLines={1}
                      ellipsizeMode ='tail'
                > {route.company.name} </Text>
              {showStar}
              <Text style={styles.textVehicle}> {route.vehicle_type}</Text>

            </View>
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
              <View style={{flexDirection:'row', alignSelf:'center', flex:1}}>
                {showWifiIcon}
                {showTVIcon}
                {showAirConIcon}
              </View>
              <View style={{alignSelf:'center', flex:1}}>
                <Button bordered info
                  onPress={() => {
                    this.props.item.booking_type == 1 ?
                    Actions.seatChoiceScreen({bookedItem:this.props.item}) :
                    Actions.customerForm({
                      bookedItem:this.props.item,
                      selectedSeats: [],
                      pickupPoints: [],
                      price: 0});
                  }}
                  textStyle={{fontSize: 12, color:`${THEME.mainBlue}`}}
                  style={styles.bookingBtn}
                >
                  <Text style={styles.bookingBtnText}>{bookingBtnTitle}</Text>
                </Button>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.textNewPrice}> {numeral(route.price.original).format('0,0')}đ</Text>
              </View>
            </View>

            <TouchableOpacity style={{
              height:25,
              zIndex: 10,
              position: 'absolute',
              top: 15,
              right: 0,
            }} onPress={() => {this.props.store.setRatingShow(true)}}>
            </TouchableOpacity>

      </View>

    </ListItem>
  )
  }
}
