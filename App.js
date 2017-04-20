import React from 'react';
import {Router, Scene} from 'react-native-mobx';
import VexereMain from './components/VexereMain';
import LocationSearch from './components/LocationSearch';
import BookingScreen from './components/BookingScreen';
import FilterScreen from './components/FilterScreen';
import SeatChoiceScreen from './components/SeatChoiceScreen';
import CustomerForm from './components/CustomerForm';
import InfoConfirmation from './components/InfoConfirmation';
import InformationWebview from './components/InformationWebview'
import EStyleSheet from 'react-native-extended-stylesheet';
import theme from './assets/theme';
import {Provider} from 'mobx-react/native';
import vexereStore from './stores/VexereMainStore';
import bookingScreenStore from './stores/BookingScreenStore';
import customerFormStore from './stores/CustomerFormStore';
import locationSearchStore from './stores/LocationSearchStore';
import seatChoiceScreenStore from './stores/SeatChoiceScreenStore';
import appStore from './stores/AppStore';



EStyleSheet.build(theme);

export default () =>
  <Provider appStore={appStore}>
    <Router>
      <Scene key='root' hideNavBar>
        <Scene key="vexereMain" component={VexereMain} store={vexereStore} initial={true}/>
        <Scene key="searchLocation" component={LocationSearch} store={locationSearchStore}/>
        <Scene key="bookingScreen" component={BookingScreen} store={bookingScreenStore}/>
        <Scene key="customerForm" component={CustomerForm} store={customerFormStore}/>
        <Scene key="filterScreen" component={FilterScreen}/>
        <Scene key="infoConfirmation" component={InfoConfirmation}/>
        <Scene key="seatChoiceScreen" component={SeatChoiceScreen} store={seatChoiceScreenStore}/>
        <Scene key="informationWebview" component={InformationWebview} />
      </Scene>
    </Router>
  </Provider>
