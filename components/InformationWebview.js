'use strict';
import React, {Component} from 'react';
import { WebView, View, Text, Platform } from 'react-native';
import { Button } from 'native-base';
import {Actions, Scene} from 'react-native-mobx';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EStyleSheet from 'react-native-extended-stylesheet';
import THEME from '../assets/theme';
import stringres from '../assets/string';
import BusLoading from '../components/widgets/BusLoading';
import ErrorSign from '../components/widgets/ErrorSign';
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
  webview: {
    height:'90%',
  },
  loadingContainer: {
    height:'10%',
    width:'100%',
    justifyContent:'center',
    alignItems:'center',
  },
  errorContainer: {
    height:'100%',
    width:'100%',
    justifyContent:'center',
    alignItems:'center',
  }
});
export default class InformationWebview extends Component {
  renderLoading () {
    return (
      <View style={styles.loadingContainer}>
        <BusLoading
          isLoading={true}
          style={{justifyContent:'center', alignSelf:'center', alignItems:'center'}} />
      </View>
    )
  }

  renderError (errorDomain, errorCode, errorDesc) {
    return (
      <View style={styles.errorContainer}>
        <ErrorSign error={stringres.value.t('vxr_webiew_load_error')} />
      </View>
    )
  }
  render() {
    return (
      <View style={{flex:1}}>
          <View style={styles.navbar}>
            <Button
              style={styles.backArrow} transparent onPress={() => {Actions.pop()}}>
              <Ionicons name={THEME.backIcon} size={25} style={{color:'white'}}/>
            </Button>
            <Text style={styles.titlePage}>{stringres.value.t('vxr_webview_info_title')}</Text>
          </View>
          <WebView style={styles.webview}
            renderLoading={this.renderLoading}
            renderError={this.renderError}
            startInLoadingState={true}
            scalesPageToFit={true}
            source={{uri: 'https://toppay.vn/tin-tuc/21-tin-tuc/501-huong-dan-mua-ve-xe-re-qua-toppay'}}
          />
      </View>
    );
  }
}
