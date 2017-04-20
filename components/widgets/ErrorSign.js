'use strict';
import React, {Component} from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Image, View, Animated, Text} from 'react-native';
import THEME from '../../assets/theme';
const styles = EStyleSheet.create({
  errorText: {
    textAlign:'center',
    color:'lightgrey',
    fontStyle:'italic',
    fontSize:'15rem',
    backgroundColor:'transparent'
  }
});
export default class ErrorSign extends Component {

  propTypes: {
    error: React.PropTypes.string;
  }

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <View style={{flexDirection:'column', flex:1, justifyContent:'center', alignItems:'center'}}>
        <Image source={require('../../assets/images/error_img.png')} />
        <Text style={styles.errorText}>{this.props.error}</Text>
      </View>
    );
  }
}
