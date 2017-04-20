import React, { Component } from 'react';
import {
  BackAndroid, Platform, ScrollView,
  TextInput, Image, Modal,
  TouchableOpacity, DatePickerAndroid,
  NativeModules, InteractionManager,
  Dimensions
} from 'react-native'
import {
  Container, Header,
  InputGroup, Input,
  Card, CardItem,
  Icon, Button, View,
  List, ListItem, Text, Content } from 'native-base';
import { Actions } from 'react-native-mobx';
import EStyleSheet from 'react-native-extended-stylesheet';
import THEME from '../assets/theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {observer, inject} from 'mobx-react/native';
import { Col, Row, Grid } from "react-native-easy-grid";
import FilterTabs from './widgets/FilterTabs';
import { MKButton, MKCheckbox, setTheme, getTheme } from 'react-native-material-kit';
import SeatIcon from './widgets/SeatIcon';
import BusLoading from '../components/widgets/BusLoading';
import ErrorSign from '../components/widgets/ErrorSign';
import stringres from '../assets/string';

let VexereModule = NativeModules.VexereModule;
let numeral = require('numeral');
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
  foregroundContainer: {
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    position: 'absolute',
    zIndex: 0,
    backgroundColor: 'whitesmoke'
  },
  seatChoiceHint: {
    color:'grey',
    fontSize:'12rem',
    backgroundColor: 'transparent',
    lineHeight:Math.round('$rem*12'),
    alignItems:'center',
    justifyContent:'center'
  },
  cardStyle: {
    elevation:1,
    height: '77%',
    marginLeft: '10rem',
    marginRight: '10rem',
    marginTop: '10rem',
    width: '95%',
    backgroundColor: 'white',
    alignSelf:'center',
    flexDirection:'column',
  },
  lineBetween: {
    width: 1,
    height: '60%',
    backgroundColor:'lightgrey',
    alignSelf:'center'
  },
  horizentalLineBetween: {
    height: 1,
    width: '90%',
    backgroundColor:'lightgrey',
    alignSelf:'center'
  },
  coachTitle: {
    textAlign:'center',
    alignSelf: 'center',
    fontWeight: 'bold',
    color:'darkgrey',
    alignItems:'center',
    fontSize: '15rem',
    marginTop:'5rem'
  },
  formaImage: {
    position:'absolute',
    top: 5,
    left: 10
  },
  seatContainer: {
    marginLeft:'4rem',
    marginRight:'4rem',
    marginTop:'15rem'
  },
  bottomContainer: {
    flexDirection:'column',
    flex:1,
    marginTop:'10rem',
    marginLeft:'5rem',
    marginRight:'5rem',
    marginBottom:'5rem',
    alignItems:'center'
  },
  textPrice: {
    color: 'orange',
    textAlign:'right',
    fontWeight:'bold',
    fontStyle:'italic',
    fontSize:'15rem',
  },
  seatAndPriceContainer: {
    width:'85%',
    flexDirection:'row',
    justifyContent:'space-between'
  },
  busLoadingContainer: {
    flex:1,
    flexDirection:'row',
    justifyContent:'center',
    marginTop:10,
    width:'100%'
  },
});

const {height:h, width:w} = Dimensions.get('window');


@inject("appStore")
@observer
export default class SeatChoiceScreen extends Component {

  state = {
    isLoading : true,
    seatsSchema: [],
    pickupPoints: [],
    error: false,
    errorText: '',
  };
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.loadSeat().then(() => {
        this.setState({isLoading: false});
      });
    });
  }

  componentWillUnmount() {
    this.props.store.resetStore();
  }

  loadSeat = async () => {
    try {
      let {seatResponse} = await VexereModule.loadSeat(this.props.bookedItem.trip_id);
      seatSchema = JSON.parse(seatResponse);
      seatTemplates = seatSchema.data.coach_seat_templates;
      this.setState({pickupPoints: seatSchema.data.pickup_points.slice()});
      console.log("Seat Response: "+JSON.stringify(seatSchema.data));
      this.loadCoachSeatTemplates(seatTemplates);
    } catch ({code, message}) {
      console.log(message);
      this.setState({error: true, errorText: message})
    }
  }

  loadCoachSeatTemplates = (coachSeatTemplates) => {

    let floorOneSeats = coachSeatTemplates[0].seats;
    let floorOneRows = coachSeatTemplates[0].number_rows;
    let floorOneCols = coachSeatTemplates[0].number_cols;
    let rows = [];
    let first_row_number = 1;

    let schema = [];

    //First Floor Render Rows
    for (let i = 0; i < floorOneRows; i++) {

      let seats = floorOneSeats.filter((seat) =>{
        return seat.row_num == i + 1;
      });
      seats.sort((a,b) => {
        return a.col_num - b.col_num;
      });
      let cols = [];

      //Render Row Column
      for (let j = 0; j < seats.length; j++) {
        let seatName = seats[j].seat_code;
        cols.push(
          <SeatIcon onCheckedChange={(checked) =>{
            if (checked) {
              this.props.store.addSeat(seats[j]);
            } else {
              this.props.store.removeSeat(seats[j]);
            }
          }} key={j} enabled={seats[j].is_available} label={seatName} store={this.props.store} />
        );
      }
      rows.push(
        <View key={i} style={{flexDirection:'row', justifyContent:'space-between', marginBottom:10}}>
          {cols}
        </View>
      );
      first_row_number+=(floorOneCols - 1);
    }
    //==========================================================//

    schema.push(
        <View key={'FirstFloor'} style={{flexDirection:'column', flex:1}}>
          <Image style={styles.formaImage} source={require('../assets/images/forma.png')} />
          <Text style={styles.coachTitle}>{stringres.value.t('vxr_floor_name', {name: 1})}</Text>
          <Content style={styles.seatContainer}>
            {rows}
          </Content>
        </View>
    );

    if (coachSeatTemplates.length > 1) {
      let floorSecondSeats = coachSeatTemplates[1].seats;
      let floorSecondRows = coachSeatTemplates[1].number_rows;
      let floorSecondCols = coachSeatTemplates[1].number_cols;
      let sec_rows = [];
      let second_row_number = 1;

      //Second Floor Render Rows
      for (let i = 0; i < floorSecondRows; i++) {

        let seats = floorSecondSeats.filter((seat) =>{
          return seat.row_num == i + 1;
        });
        seats.sort((a,b) => {
          return a.col_num - b.col_num;
        });
        let cols = [];

        //Render Row Column
        for (let j = 0; j < seats.length; j++) {
          let seatName = seats[j].seat_code;
          cols.push(
            <SeatIcon onCheckedChange = {(checked) =>{
                if (checked) {
                  this.props.store.addSeat(seats[j]);
                } else {
                  this.props.store.removeSeat(seats[j]);
                }

              }} key={j} enabled={seats[j].is_available} label={seatName} store={this.props.store} />
          );
        }
        sec_rows.push(
          <View key={i} style={{flexDirection:'row', justifyContent:'space-between', marginBottom:10}}>
            {cols}
          </View>
        );
        second_row_number+=(floorSecondCols - 1);
      }
      //==========================================================//


      schema.push(
        <View key={'LineBetween'} style={styles.lineBetween} />
      );
      schema.push(
          <View key={'SecondFloor'} style={{flexDirection:'column', flex:1}}>
            <Text style={styles.coachTitle}>{stringres.value.t('vxr_floor_name', {name: 2})}</Text>
            <Content style={styles.seatContainer}>
              {sec_rows}
            </Content>
          </View>
      );
    }

    this.setState({seatsSchema: schema.slice()})
  }

  render() {
    const renderSchema = this.state.seatsSchema;
    const isValid = this.props.store.selectedSeats.length > 0;
    const FlatButton = MKButton.flatButton()
      .withBackgroundColor(isValid ? THEME.mainBlue : 'lightgrey')
      .withText(stringres.value.t('vxr_book_seat'))
      .withTextStyle({
          color: 'white',
          fontWeight: 'bold',
        })
      .withEnabled(isValid)
      .withStyle({
        width: w*0.90,
        alignSelf:'center',
        marginTop: 10,
      })
      .withOnPress(() => {
        Actions.customerForm({
          bookedItem: this.props.bookedItem,
          selectedSeats: this.props.store.selectedSeats,
          pickupPoints: this.state.pickupPoints,
          price: this.props.store.totalPrice
        });
        console.log('Seat Price: '+this.props.store.totalPrice);
      })
      .build()
    return (
      <View>
          <View style={styles.foregroundContainer} />
          <View style={styles.navbar}>
            <Button
              style={styles.backArrow} transparent onPress={() => {Actions.pop()}}>
              <Ionicons name={THEME.backIcon} size={25} style={{color:'white'}}/>
            </Button>
            <Text style={styles.titlePage}>{stringres.value.t('vxr_select_seat')}</Text>
          </View>
          {this.state.isLoading ?
            <View style={styles.busLoadingContainer}>
              <BusLoading
                isLoading={this.state.isLoading}
                style={{justifyContent:'center', alignSelf:'center'}} />
            </View> : this.state.error ? <ErrorSign error={this.state.errorText} /> :
            <View>
              <Text style={{
                color:'darkgrey',
                fontSize: 12,
                marginLeft: 20,
                marginTop:10,
                backgroundColor: 'transparent'}}>{stringres.value.t('vxr_choose_seat_tip')}</Text>
              <View style={{flexDirection:'row', justifyContent:'space-between', marginLeft: 20, marginRight:20}}>
                <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                  <Image style={{height:12, width:12, alignSelf:'center'}} source={require('../assets/images/white-circle-ico.png')} />
                  <Text style={styles.seatChoiceHint}> {stringres.value.t('vxr_available_seat')} </Text>
                </View>
                <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                  <Image style={{height:12, width:12}} source={require('../assets/images/grey-circle-ico.png')} />
                  <Text style={styles.seatChoiceHint}> {stringres.value.t('vxr_unavailable_seat')} </Text>
                </View>
                <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                  <Image style={{height:12, width:12}} source={require('../assets/images/blue-circle-ico.png')} />
                  <Text style={styles.seatChoiceHint}> {stringres.value.t('vxr_selected_seat')} </Text>
                </View>
              </View>
              <View style={styles.cardStyle}>

                <View style={{flexDirection:'row', flex:5}}>
                  {renderSchema}
                </View>

                <View style={styles.horizentalLineBetween} />
                <View style={styles.bottomContainer}>
                  <View style={styles.seatAndPriceContainer}>
                    <Text style={{
                      fontSize:12,
                      color:'grey'}}>{stringres.value.t('vxr_selected_seat_count_text')} <Text
                                                  style={{
                                                    fontSize:12,
                                                    fontWeight:'bold',
                                                    color:'royalblue'}}>{this.props.store.selectedSeats.length}</Text> {stringres.value.t('vxr_selected_seat_count', {count: this.props.store.selectedSeats.length})}</Text>
                    <Text style={styles.textPrice}>{numeral(this.props.store.totalPrice).format('0,0')}đ</Text>
                  </View>
                  <FlatButton />
                </View>
            </View>
          </View>
        }
      </View>
        )
  }

}
