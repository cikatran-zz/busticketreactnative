import React, { Component } from 'react';
import {
  BackAndroid, Platform, ScrollView,
  TextInput, Image, Modal,
  TouchableOpacity, DatePickerAndroid,
  Dimensions, PixelRatio, InteractionManager
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
import FilterTabs from './widgets/FilterTabs';
import { MKButton, MKCheckbox, setTheme, getTheme } from 'react-native-material-kit';
import BusLoading from '../components/widgets/BusLoading';
import stringres from '../assets/string';

setTheme({checkboxStyle: {
  fillColor: `${THEME.mainBlue}`,
  borderOnColor: `${THEME.mainBlue}`,
  borderOffColor: `${THEME.mainBlue}`,
  rippleColor: `${THEME.mainBlue}00`,
}});

const theme = getTheme();

const {height:h, width:w} = Dimensions.get('window');


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
  paddingTop: (Platform.OS === 'ios' ) ? 15 : 0,
  height: '$toolbarHeight - 10',
  position: 'relative'
  },
  tabView: {
    flex: 1,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },
  card: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    margin: 5,
    height: 150,
    padding: 15,
    shadowColor: '#ccc',
    shadowOffset: { width: 2, height: 2, },
    shadowOpacity: 0.5,
    shadowRadius: 3,
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
  titlePage: {
    alignSelf:'center',
    alignItems:'center',
    textAlign:'center',
    color:'white',
    fontWeight:'bold',
    marginLeft:'20rem'
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
    color:'white',
    fontSize: 14,
  }
});

let ScrollableTabView = require('react-native-scrollable-tab-view');
const FILTER_KIND = Object.freeze({FROM: 0, TO: 1, COMPANY_NAME: 2, TIME: 3});
let filterFromArray = [];
let filterToArray = [];
let filterCompanyNameArray = [];
let filterTimeArray = [];
@inject("appStore")
@observer
export default class FilterScreen extends Component {

  state = {
    isLoading : false,
  };

  componentWillMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      this.setState({isLoading: true});
      InteractionManager.runAfterInteractions(() => {
        this.performFilter().then(() => {
          this.setState({isLoading: false});
          Actions.pop();
        });
      });
      return true;
    });
  };

  componentWillUnmount(){
    BackAndroid.removeEventListener('hardwareBackPress', () => {
      this.setState({isLoading: true});
      InteractionManager.runAfterInteractions(() => {
        this.performFilter().then(() => {
          this.setState({isLoading: false});
          Actions.pop();
        });
      });
      return true;
    });
  }

   renderRow(item, kind) {
     return (
      <ListItem>
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <Text style={{alignSelf:'center'}}>{item.item}</Text>
          <MKCheckbox
            onCheckedChange = {(e) => {
              item.checked = e.checked;
            }}
            checked={item.checked} />
        </View>

      </ListItem>
    );
  };

  performFilter = async() => {

    let appStore = this.props.appStore;
    filterFromArray = appStore.filterFromLocationArray.filter((item) => {
      return item.checked;
    });
    filterFromArray = filterFromArray.map((item) => {
      return item.item;
    });

    filterToArray = appStore.filterToLocationArray.filter((item) => {
      return item.checked;
    });
    filterToArray = filterToArray.map((item) => {
      return item.item;
    });

    filterCompanyNameArray = appStore.filterCompanyNameArray.filter((item) => {
      return item.checked;
    });
    filterCompanyNameArray = filterCompanyNameArray.map((item) => {
      return item.item;
    });

    filterTimeArray = appStore.filterDepartureTimeArray.filter((item) => {
      return item.checked;
    });
    filterTimeArray = filterTimeArray.map((item) => {
      return item.item;
    });

    let tripArray = appStore.originalTripArray.slice();
    tripArray = tripArray.filter((trip) => {
      let fromCondition = filterFromArray.toString() === "" ? true : filterFromArray.toString().includes(trip.departure);
      let toCondition = filterToArray.toString() === "" ? true : filterToArray.toString().includes(trip.destination);
      let companyNameCondition = filterCompanyNameArray.toString() === "" ? true : filterCompanyNameArray.toString().includes(trip.company.name);
      let timeCondition = filterTimeArray.toString() === "" ? true : filterTimeArray.toString().includes(trip.departure_time);
      return fromCondition && toCondition && companyNameCondition && timeCondition;
    });
    appStore.setTrips(tripArray);
  };

  resetFilter = async() => {
    let appStore = this.props.appStore;
    let filterFromLocationArray = appStore.filterFromLocationArray.map((item) => {
      item.checked = false;
      return item;
    });
    appStore.setFilterFromLocation(filterFromLocationArray);
    let filterToLocationArray = appStore.filterToLocationArray.map((item) => {
      item.checked = false;
      return item;
    });
    appStore.setFilterToLocation(filterToLocationArray);
    let filterCompanyNameArray = appStore.filterCompanyNameArray.map((item) => {
      item.checked = false;
      return item;
    });
    appStore.setFilterCompanyName(filterCompanyNameArray);
    let filterDepartureTimeArray = appStore.filterDepartureTimeArray.map((item) => {
      item.checked = false;
      return item;
    });
    appStore.setFilterDepartureTime(filterDepartureTimeArray);
    let tripArray = appStore.originalTripArray.slice();
    appStore.setTrips(tripArray);
  };

  render() {
    let appStore = this.props.appStore;
    // const FlatButton = MKButton.flatButton()
    //   .withBackgroundColor(THEME.mainBlue)
    //   .withText('XÁC NHẬN')
    //   .withTextStyle({
    //       color: 'white',
    //       fontWeight: 'bold',
    //     })
    //   .withStyle({
    //     width: 329,
    //     alignSelf:'center',
    //     marginBottom: 10,
    //   })
    //   .withOnPress(() => {Actions.pop()})
    //   .build();

    return (
      <View>
          <View style={styles.navbar}>
            <Button
              style={styles.backArrow} transparent onPress={() => {
                this.setState({isLoading: true});
                InteractionManager.runAfterInteractions(() => {
                  this.performFilter().then(() => {
                    this.setState({isLoading: false});
                    Actions.pop();
                  });
                });
              }}>
              <Ionicons name={THEME.backIcon} size={25} style={{color:'white'}}/>
            </Button>
            <Text style={styles.titlePage}>{stringres.value.t('vxr_filter')}</Text>
            <TouchableOpacity onPress={() => {
              this.setState({isLoading: true});
              InteractionManager.runAfterInteractions(() => {
                this.resetFilter().then(() => {
                  this.setState({isLoading: false});
                  Actions.pop();
                });
              });
            }}>
              <Text
                style={styles.navRightBtn}>
                {stringres.value.t('vxr_no_filter')}
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollableTabView renderTabBar={() => <FilterTabs/>}>
            <List
              tabLabel = 'my-location'
              dataArray = {appStore.filterFromLocationArray}
              renderRow = {(item) => this.renderRow(item, FILTER_KIND.FROM)}
            />
            <List
              tabLabel = 'place'
              dataArray = {appStore.filterToLocationArray}
              renderRow = {(item) => this.renderRow(item, FILTER_KIND.TO)}
            />
            <List
              tabLabel = 'directions-bus'
              dataArray = {appStore.filterCompanyNameArray}
              renderRow = {(item) => this.renderRow(item, FILTER_KIND.COMPANY_NAME)}
            />
            <List
              tabLabel = 'access-time'
              dataArray = {appStore.filterDepartureTimeArray}
              renderRow = {(item) => this.renderRow(item, FILTER_KIND.TIME)}
            />
          </ScrollableTabView>

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
