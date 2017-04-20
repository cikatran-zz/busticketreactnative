import React, { Component } from 'react';
import {
  BackAndroid, Platform,
  TextInput, Image, Modal,
  TouchableOpacity, DatePickerAndroid,
  NativeModules, InteractionManager,
  Dimensions, PixelRatio, DatePickerIOS
} from 'react-native'
import {
  Container, Header,
  InputGroup, Input,
  Card, CardItem,
  Icon, Button, View,
  List, ListItem, Text } from 'native-base';
import { Actions } from 'react-native-mobx';
import EStyleSheet from 'react-native-extended-stylesheet';
import THEME from '../assets/theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {observer, inject} from 'mobx-react/native';
import { Col, Row, Grid } from "react-native-easy-grid";
import moment from 'moment';
import 'moment/locale/vi';
import 'moment/locale/en-gb';
import { MKRadioButton, setTheme, getTheme } from 'react-native-material-kit';
import TripCard from '../components/widgets/TripCard';
import BusLoading from '../components/widgets/BusLoading';
import ErrorSign from '../components/widgets/ErrorSign';
import stringres from '../assets/string';

setTheme({radioStyle: {
  fillColor: `${THEME.mainBlue}`,
  borderOnColor: `${THEME.mainBlue}`,
  borderOffColor: `${THEME.mainBlue}`,
  rippleColor: `${THEME.mainBlue}00`,
}});

const theme = getTheme();
let VexereModule = NativeModules.VexereModule;
const {height:h, width:w} = Dimensions.get('window');

const RATING_KIND = Object.freeze({OVERALL: 0, BUS_QUALITY: 1, ON_TIME: 2, SERVICE: 3});
const SORT_KIND = Object.freeze({RATING: 0, COMPANY_NAME: 1, PRICE: 2});

/* Style Config */
const styles = EStyleSheet.create({
  header: {
    backgroundColor: '$mainBlue',
  },
  navbar: {
    backgroundColor: '$mainBlue',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: (Platform.OS === 'ios' ) ? '15rem' : 0,
    height: '$toolbarHeight - 10',
    elevation: 3,
    position: 'relative'
  },
  locationBar: {
  backgroundColor: '$mainBlue',
  flexDirection: 'column',
  elevation: 3,
  height: '$locationReChooseBarHeight',
  position: 'relative',
  },
  container: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationContainer: {
    alignSelf:'center',
    justifyContent:'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '5rem',
    width:'90%'
  },
  topbarText: {
    color: 'white',
    fontSize: 14
  },
  filterBar: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent:'flex-start',
    alignItems:'center',
    height: '100rem',
    elevation: 3,
    height: '40rem',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
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
  filterText: {
    fontSize:13,
    color: 'grey',
    lineHeight:15
  },
  popupCard: {
    flexDirection:'column',
    alignSelf:'center',
    height: h*0.30,
    width: '80%',
    alignItems:'center',
    borderRadius:10,
    justifyContent:'space-between',
    backgroundColor:'white',
    padding:'10rem'
  },
  popupRateContainer: {
    flexDirection:'column',
    flex:3,
    borderBottomWidth:0.5,
    borderColor:'lightgrey',
    width:'80%',
    marginTop:'5rem',
    paddingBottom:'20rem'
  },
  popupStarContainer: {
    flexDirection:'row',
    justifyContent:'center',
    alignSelf:'flex-start',
    marginTop:5,
    marginRight:20
  },
  popupText: {
    color: 'grey',
    marginLeft: 20,
    fontSize: 14
  },
  closeText: {
    color: '$mainBlue',
    textAlign:'center',
    alignSelf:'center',
    alignItems:'center',
    fontWeight:'bold',
    marginTop:h*0.00058
  },
  titlePage: {
    alignSelf:'center',
    alignItems:'center',
    textAlign:'center',
    color:'white',
    fontWeight:'bold',
    width: (Platform.OS === 'ios' ) ? '80%' : '75%',
  },
  busDirectionImage: {
    height: '23rem',
    width: '26rem',
    alignSelf:'center'
  },
  closeButton: {
    justifyContent:'center',
    flex:1,
    alignSelf:'center',
    alignItems:'center',
  },
  radioButtonContainer: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    alignSelf:'center',
    width:'70%',
    marginLeft:'20rem'
  },
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
  busLoadingContainer: {
    flex:1,
    flexDirection:'row',
    justifyContent:'center',
    marginTop:h*0.030,
    width:'100%'
  },
  backArrow:{
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginLeft: '-10rem',
    marginRight: '12rem',
  },
  navRightBtn: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    alignSelf:'center',
    flexDirection: 'row',
    marginRight: '-15rem',
  }
});

@inject("appStore")
@observer
export default class BookingScreen extends Component {

  state = {
    isLoading : true,
    sortKind: SORT_KIND.RATING,
    error: false,
    errorText: ''
  };

  constructor() {
    super();
    this.radioGroup = new MKRadioButton.Group();
  }

  componentWillMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => Actions.pop());
  };

  componentWillUnmount(){
    BackAndroid.removeEventListener('hardwareBackPress', () => Actions.pop());
  }

  componentDidMount() {
    moment.locale(VexereModule.locale);
    InteractionManager.runAfterInteractions(() => {
      this.loadTrip().then(() => {
        this.setState({isLoading: false});
      });
  })
  }

  /*====================Show Date Picker functions=====================*/

  showAndroidDatePicker = async (stateKey, options) => {
    console.log(options);
     try {

       if (options.date == '') {
         options.date = new Date();
       } else {
         let momentObj = moment(options.date, 'ddd, DD/MM/YYYY');
         momentObj.locale(stringres.value.currentLocale());
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
         this.loadTrip().then(() => {
           this.setState({isLoading: false});
         });
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
    this.props.store.setShownIOSDatePicker(isShown)
  };

  onIOSDateChanged = (date) => {
    this.props.appStore.setBookingDate(moment(date).format('ddd, DD/MM/YYYY'));
  };

  changeDate = () => {
    this.setState({minDate:dateChanged});
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
    this.setState({isLoading: true});
    this.loadTrip().then(() => {
      this.setState({isLoading: false});
    });
  }

  changeSort = async() => {
    let appStore = this.props.appStore;
    appStore.setTrips(appStore.tripArray.reverse());
    appStore.setOriginalTrips(appStore.originalTripArray.reverse());
  }

  sortByRating = (a,b) => {
    let store = this.props.store;
    console.log("Sort by Rating");
    switch (store.sort) {
      case 1:
        return a.company.ratings.overall - b.company.ratings.overall;
        break;
      case 0:
        return b.company.ratings.overall - a.company.ratings.overall;
        break;
      default:
        return true;
        break;
    }
  };

  sortByPrice = (a,b) => {
    console.log("Sort by Price");
    let store = this.props.store;
    switch (store.sort) {
      case 1:
        return a.price.original - b.price.original;
        break;
      case 0:
        return b.price.original - a.price.original;
        break;
      default:
        return true;
        break;
    }
  };

  sortByComapnyName = (a,b) => {
    console.log("Sort by Company");
    let store = this.props.store;
    switch (store.sort) {
      case 0:
        return a.company.name.localeCompare(b.company.name, 'vi', { sensitivity: 'base' });
        break;
      case 1:
        return b.company.name.localeCompare(a.company.name, 'vi', { sensitivity: 'base' });
        break;
      default:
        return true;
        break;
    }
  };

  performSort = async(kind) => {
    let appStore = this.props.appStore;
    let tripArray = [];
    let originalTripArray = [];
    console.log("Sort by:" + kind);
    switch (kind) {
      case SORT_KIND.RATING:
        tripArray = appStore.tripArray.sort(this.sortByRating);
        originalTripArray = appStore.originalTripArray.sort(this.sortByRating);
        break;
      case SORT_KIND.COMPANY_NAME:
        tripArray = appStore.tripArray.sort(this.sortByComapnyName);
        originalTripArray = appStore.originalTripArray.sort(this.sortByComapnyName);
        break;
      case SORT_KIND.PRICE:
        tripArray = appStore.tripArray.sort(this.sortByPrice);
        originalTripArray = appStore.originalTripArray.sort(this.sortByPrice);
        break;
      default:
        break;

    }
    console.log("First:" + tripArray[0].company.name);
    appStore.setTrips(tripArray);
    appStore.setOriginalTrips(originalTripArray);
  }


   loadTrip = async () => {
    let store = this.props.store;
    let appStore = this.props.appStore;
    let departure = appStore.startLocation.code;
    let destination = appStore.stopLocation.code;
    let date = appStore.bookingDate;
    let momentObj = moment(date, 'ddd, DD/MM/YYYY');
    momentObj.locale(stringres.value.currentLocale());
    let momentDateString = momentObj.format('DD-MM-YYYY');
    this.setState({isLoading: true});
    console.log('load Trip....' + stringres.value.currentLocale());
    try {
      let {tripResponse} = await VexereModule.loadTrip(departure, destination, momentDateString);
      let trips = JSON.parse(tripResponse);
      routes = trips.data.routes;
      console.log("Trip Response: "+JSON.stringify(tripResponse));
      routes = routes.filter((r) => {
        return r.available_seat || r.booking_type==2;
      });
      if (routes.length < 1) {
        this.setState({error: true, errorText:stringres.value.t('vxr_error_route_not_found')})
      } else {
        this.setState({error:false});
      }
      //get Filter From Location
      let fromArray = [...new Set(routes.map((item) => {
        return item.departure;
      }))];
      fromArray = fromArray.map((item) => {
        return {item:item, checked: false};
      });
      fromArray.sort((a,b) => {
        return a.item.localeCompare(b.item, 'vi', { sensitivity: 'base' });
      });
      appStore.setFilterFromLocation(fromArray);

      //get Filter To Location
      let toArray = [...new Set(routes.map((item) => {
        return item.destination;
      }))];
      toArray = toArray.map((item) => {
        return {item:item, checked: false};
      });
      toArray.sort((a,b) => {
        return a.item.localeCompare(b.item, 'vi', { sensitivity: 'base' });
      })
      appStore.setFilterToLocation(toArray);

      //get Filter Company Name
      let companyNameArray = [...new Set(routes.map((item) => {
        return item.company.name;
      }))];
      companyNameArray = companyNameArray.map((item) => {
        return {item:item, checked: false};
      });
      companyNameArray.sort((a,b) => {
        return a.item.localeCompare(b.item, 'vi', { sensitivity: 'base' });
      })
      appStore.setFilterCompanyName(companyNameArray);

      //get Filter Departure Time
      let departureTimeArray = [...new Set(routes.map((item) => {
        return item.departure_time;
      }))];
      departureTimeArray = departureTimeArray.map((item) => {
        return {item:item, checked: false};
      });
      departureTimeArray.sort((a,b) => {
        return a.item.localeCompare(b.item, 'vi', { sensitivity: 'base' });
      })
      appStore.setFilterDepartureTime(departureTimeArray);

      routes.sort(this.sortByRating);
      console.log('Trip response:' + departureTimeArray);
      appStore.setTrips(routes);
      appStore.setOriginalTrips(routes);
    } catch ({code, message}) {
      console.log(message);
      this.setState({error: true, errorText: message})
    }
  }

  renderRating (routes, index, key) {
    let star = [];
    let rating = 0;
    if (routes.length == 0) {
      return star;
    }
    switch (key) {
      case RATING_KIND.OVERALL:
        rating = Math.round(routes[index].company.ratings.overall);
        break;
      case RATING_KIND.BUS_QUALITY:
        rating = Math.round(routes[index].company.ratings.bus_quality);
        break;
      case RATING_KIND.ON_TIME:
        rating = Math.round(routes[index].company.ratings.on_time);
        break;
      case RATING_KIND.SERVICE:
        rating = Math.round(routes[index].company.ratings.service);
        break;
      default:

    }

    for (let i = 0; i < rating; i++) {
      star.push(
        <Image key={i} style={{width: 16, height: 16, marginRight:2}} source={require('../assets/images/big-star-orange.png')}/>
      );
    }
    return star;
  }

  render() {
    let showMaskIOS = this.props.store.isShownIOSDatePicker ? <View style={{
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      top:0,
      bottom:0,
      left:0,
      right:0,
      position:'absolute'
    }}/> : null;
    let store = this.props.store;
    let bookingDate = this.props.appStore.bookingDate;
    if (bookingDate == '') {
      bookingDate = new Date();
    } else {
      let momentObj = moment(bookingDate, 'ddd, DD/MM/YYYY');
      momentObj.locale(stringres.value.currentLocale());
      let momentDateString = momentObj.format('YYYY-MM-DD');
      console.log(momentDateString);
      let parts = momentDateString.match(/(\d+)/g);
      console.log(parts);
      bookingDate = new Date(parts[0], parts[1]-1, parts[2]);
    };

    let routes = this.props.appStore.tripArray.slice();
    let ratingIndex = this.props.store.ratingIndex;
    let renderBus = null;
    const renderRow = (item, section, index) => (
      <TripCard item={item} store={this.props.store} index={index}/>
    );
    if (this.state.isLoading) {
      renderBus = <View style={styles.busLoadingContainer}>
          <BusLoading isLoading={this.state.isLoading}
         style={{justifyContent:'center', alignSelf:'center'}} />
      </View>
    } else {
      if (this.state.error) {
        renderBus = <ErrorSign error={this.state.errorText} />;
      } else {
        renderBus = <View style={{flex:1}}>
          <List
            scrollRenderAheadDistance={10}
            dataArray = {this.props.appStore.dataSource}
            renderRow = {renderRow}
          />
        </View>
      }
    }

      return (
          <View>
              <View style={styles.foregroundContainer} />
              <View style={styles.navbar}>
                <Button
                  style={styles.backArrow} transparent onPress={() => {Actions.pop()}}>
                  <Ionicons name={THEME.backIcon} size={25} style={{color:'white'}}/>
                </Button>
                <Text style={styles.titlePage}>{stringres.value.t('vxr_route_title')}</Text>
                <Button
                  style={styles.navRightBtn} transparent
                  onPress={() => {Actions.filterScreen()}}
                  disabled={this.state.isLoading||this.state.error}>
                  <MaterialIcons name="filter-list" size={25} style={{color:'white'}}/>
                </Button>
              </View>

              <View style={styles.locationBar}>
                <View style={styles.locationContainer}>

                  <Col style={{flexDirection:'row', justifyContent:'flex-start'}}>
                      <View style={{flexDirection:'row', alignSelf:'center'}}>
                        <Text style={styles.topbarText}> { this.props.appStore.startLocation.name } </Text>
                      </View>
                  </Col>
                  <TouchableOpacity disabled={this.state.isLoading} onPress={this.changeDirection}>
                    <Image style={styles.busDirectionImage} source={require('../assets/images/bus-direction-ico.png')}/>
                  </TouchableOpacity>

                  <Col style={{flexDirection:'row', justifyContent:'flex-end'}}>
                      <View style={{flexDirection:'row', alignSelf:'center'}}>
                        <Text style={styles.topbarText}> { this.props.appStore.stopLocation.name } </Text>
                      </View>
                  </Col>

                </View>
                <TouchableOpacity disabled={this.state.isLoading} onPress={this.showDatePicker}>
                  <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                    <Text style={styles.topbarText}> { this.props.appStore.bookingDate } </Text>
                    <Image style={{height: 5, width: 11, alignSelf:'center'}} source={require('../assets/images/dropdown-ico.png')}/>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.filterBar}>
                <TouchableOpacity disabled={this.state.isLoading||this.state.error} onPress={() => {
                  this.setState({isLoading: true});
                  if (store.sort == 0) {
                    store.setSort(1);
                  } else {
                    store.setSort(0);
                  }
                  InteractionManager.runAfterInteractions(() => {
                    this.changeSort().then(() => {
                      this.setState({isLoading: false});
                    });;
                  });
                }}>
                  <Image
                    style={{
                      height: 18,
                      width: 26,
                      alignSelf:'center',
                      marginLeft:15}}
                      source={
                        this.props.store.sort == 0 ?
                        require('../assets/images/sort-ascending-ico.png') :
                        require('../assets/images/sort-descending-ico.png')
                      }/>
                </TouchableOpacity>
                <View style={styles.radioButtonContainer}>
                  <TouchableOpacity disabled={this.state.isLoading||this.state.error} onPress={() => {this.setState({sortKind: SORT_KIND.RATING})}}>
                    <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                      <MKRadioButton
                        style={{height:10, width:10}}
                        checked={this.state.sortKind == SORT_KIND.RATING}
                        onCheckedChange={(item) => {
                              if(item.checked) {
                                this.setState({isLoading: true});
                                InteractionManager.runAfterInteractions(() => {
                                  this.performSort(SORT_KIND.RATING).then(() => {
                                    this.setState({isLoading: false});
                                  });;
                                });
                              }
                            }}
                        group={this.radioGroup} />
                        <Text style={styles.filterText}> {stringres.value.t('vxr_rating')} </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity disabled={this.state.isLoading||this.state.error} onPress={() => {this.setState({sortKind: SORT_KIND.COMPANY_NAME})}}>
                    <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                      <MKRadioButton
                        style={{height:10, width:10}}
                        checked={this.state.sortKind == SORT_KIND.COMPANY_NAME}
                        onCheckedChange={(item) => {
                            if(item.checked)
                              this.setState({isLoading: true});
                              InteractionManager.runAfterInteractions(() => {
                                this.performSort(SORT_KIND.COMPANY_NAME).then(() => {
                                  this.setState({isLoading: false});
                                });;
                              });
                            }}
                        group={this.radioGroup} />
                        <Text style={styles.filterText}> {stringres.value.t('vxr_provider')} </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity disabled={this.state.isLoading||this.state.error} onPress={() => {this.setState({sortKind: SORT_KIND.PRICE})}}>
                    <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                      <MKRadioButton
                        style={{height:10, width:10}}
                        checked={this.state.sortKind == SORT_KIND.PRICE}
                        onCheckedChange={(item) => {
                            if(item.checked)
                              this.setState({isLoading: true});
                              InteractionManager.runAfterInteractions(() => {
                                this.performSort(SORT_KIND.PRICE).then(() => {
                                  this.setState({isLoading: false});
                                });;
                              });
                            }}
                        group={this.radioGroup} />
                        <Text style={styles.filterText}> {stringres.value.t('vxr_price')} </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              {renderBus}

              <Modal
                animationType={"fade"}
                transparent={true}
                visible={this.props.store.ratingShow}
                onRequestClose={() => {this.props.store.setRatingShow(false);}}
                >
                <TouchableOpacity style={{top:0,
                  bottom:0,
                  left:0,
                  right:0,
                  position:'absolute'}} onPress={() => {this.props.store.setRatingShow(false);}}>
                <View style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  top:0,
                  bottom:0,
                  left:0,
                  right:0,
                  position:'absolute'
                }}/>
                  </TouchableOpacity>
                <View style={{
                  flex: 1,
                  justifyContent: 'center',
                }}>
                <View style={[styles.popupCard]}>
                  <Text style={{flex:1}}>{stringres.value.t('vxr_provider_rating_title')}</Text>
                  <View style={styles.popupRateContainer}>
                    <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                      <Text style={styles.popupText}> {stringres.value.t('vxr_provider_rating_overall')} </Text>
                      <View style={styles.popupStarContainer}>
                        {this.renderRating(routes, ratingIndex, 0)}
                      </View>
                    </View>

                    <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                      <Text style={styles.popupText}> {stringres.value.t('vxr_provider_rating_quality')} </Text>
                      <View style={styles.popupStarContainer}>
                        {this.renderRating(routes, ratingIndex, 1)}
                      </View>
                    </View>

                    <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                      <Text style={styles.popupText}> {stringres.value.t('vxr_provider_rating_ontime')} </Text>
                      <View style={styles.popupStarContainer}>
                        {this.renderRating(routes, ratingIndex, 2)}
                      </View>
                    </View>

                    <View style={{justifyContent:'space-between', flexDirection:'row', marginBottom:5}}>
                      <Text style={styles.popupText}> {stringres.value.t('vxr_provider_rating_service')} </Text>
                      <View style={styles.popupStarContainer}>
                        {this.renderRating(routes, ratingIndex, 3)}
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => {this.props.store.setRatingShow(false)}}>
                    <Text style={styles.closeText}>{stringres.value.t('vxr_close')}</Text>
                  </TouchableOpacity>
                </View>
                </View>
              </Modal>

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
                      this.props.store.setShownIOSDatePicker(false);
                      this.setState({isLoading: true});
                      this.loadTrip().then(() => {
                        this.setState({isLoading: false});
                      });
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
      );
  }
}
