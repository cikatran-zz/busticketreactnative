import React, { Component } from 'react';
import { BackAndroid, Platform, TextInput, NativeModules, InteractionManager, Dimensions, PixelRatio } from 'react-native'
import {
  Container, Header,
  InputGroup, Input,
  Icon, Button, View,
  List, ListItem, Text, Spinner } from 'native-base';
import { Actions } from 'react-native-mobx';
import EStyleSheet from 'react-native-extended-stylesheet';
import THEME from '../assets/theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BusLoading from '../components/widgets/BusLoading';
import {observer, inject} from 'mobx-react/native';
import ErrorSign from '../components/widgets/ErrorSign';
import stringres from '../assets/string';

let VexereModule = NativeModules.VexereModule;
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
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    height: '$toolbarHeight',
    elevation: 3,
    position: 'relative'
},
toolbarSearch: {
  height: h*0.060,
  backgroundColor: '#fff',
  borderRadius: 2,
  borderColor: 'transparent',
  elevation: 2,
  flex:1,
  marginTop: (Platform.OS === 'ios' ) ?  10 : 0
},
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
});

const MK = require('react-native-material-kit');
const {
  MKButton,
  MKColor,
  MKTextField,
  mdl,
} = MK;
const latinize = require('latinize');

let placeArray = [];
@inject("appStore")
@observer
export default class LocationSearch extends Component {

  state = {
    isLoading : true,
    error: false,
    errorText: '',
  };

  componentWillMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => Actions.pop());
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.loadDeparture().then(() => {
        this.setState({isLoading: false});
      });
  })

  }
  handleListItemPress = (item) => {
    let appStore = this.props.appStore;
    if (appStore.typeOfLocation == 0) {
      appStore.setStartLocation(item);
    } else {
      appStore.setStopLocation(item)
    };
    Actions.pop();
  };


  _onSearch = (searchText) => {
    searchText = latinize(searchText).toLowerCase();
    searchResults = [];
    searchResults = placeArray.filter((item) => {
      return item.normalizedname.toLowerCase().includes(searchText);

    });
    if (this.props.appStore.typeOfLocation == 0) {
      this.props.store.setDepartures(searchResults);
    } else {
      this.props.store.setDestinations(searchResults);
    }

  };

  loadDeparture = async () => {
    let store = this.props.store;
    let appStore = this.props.appStore;
    this.setState({isLoading: true});
    console.log('load departure....');
    let kindOfSearch = '';
    let departures = '';
    try {
      if (appStore.typeOfLocation == 0) {
        let {departureResponse} = await VexereModule.loadDeparture();
        departures = JSON.parse(departureResponse);
        kindOfSearch = 'Departure';
        console.log('Departures response:' + departureResponse);
      } else {
        let {destinationResponse} = await VexereModule.loadDestination();
        departures = JSON.parse(destinationResponse);
        kindOfSearch = 'Destination';
        console.log('Destination response:' + destinationResponse);
      };

      departures = departures.data;
      placeArray = [];
      for (let [key, value] of Object.entries(departures)) {
          placeArray.push({
           code: key,
           name: value,
           normalizedname: latinize(value)
         });
      }

      if (appStore.typeOfLocation == 0) {
        store.setDepartures(placeArray);
      } else {
        store.setDestinations(placeArray);
      }

    } catch ({code, message}) {
      this.setState({error: true, errorText: message})
    }
  }

  render() {
    let items = ['Hồ Chí Minh', 'Buôn Mê Thuột', 'Nha Trang', 'Đà Lạt', 'Rạch Giá'];
    let store = this.props.store;
    let searchData = this.props.appStore.typeOfLocation == 0 ? store.departureArray : store.destinationArray;
    const renderRow = (item) => (
      <ListItem button onPress={() => this.handleListItemPress(item)}>
        <View style={{flexDirection:'row'}}>
          <MaterialIcons size={20} name='location-on' style={{color: 'grey', marginRight:20}} />
          <Text>{item.name}</Text>
        </View>

      </ListItem>
    );
      return (
          <View>
              <View style={styles.navbar}>
                <Button
                  style={styles.backArrow} transparent onPress={() => {Actions.pop()}}>
                  <Ionicons name={THEME.backIcon} size={25} style={{color:'white'}}/>
                </Button>
                <TextInput
                  style={styles.toolbarSearch}
                  placeholder={stringres.value.t('vxr_location')}
                  underlineColorAndroid='transparent'
                  editable={!this.state.isLoading && !this.state.error}
                  onChangeText={(text) => {
                      this._onSearch(text);
                  }}/>
              </View>
              {this.state.isLoading ?
                <View style={styles.busLoadingContainer}>
                  <BusLoading
                    isLoading={this.state.isLoading}
                    style={{justifyContent:'center', alignSelf:'center'}} />
                </View> : this.state.error ? <ErrorSign error={this.state.errorText}/> :
                <View style={{flex:1}}>
                  <List
                    scrollRenderAheadDistance={10}
                    keyboardShouldPersistTaps={true}
                    keyboardDismissMode='on-drag'
                    dataArray = {searchData}
                    renderRow = {renderRow}
                  />
                </View>
              }
              </View>
      );
  }
}
