'use strict';
import React, {Component} from 'react';
import {
  Header, Container, Footer,
  Text, View,
  Title, Content, List,
  ListItem, Icon,
  Card, CardItem, Thumbnail, Button
} from 'native-base';
import {
  AppRegistry, StyleSheet, DatePickerAndroid, Platform, Dimensions, Image,
  TouchableWithoutFeedback, AsyncStorage
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {observer} from 'mobx-react/native';

const styles = EStyleSheet.create({
  outBox: {
    height: '37.5rem',
    width: '30rem',
    justifyContent: 'center',
    alignSelf:'center',
    borderWidth: 1,
    borderRadius: 2,
  },
  insideBox: {
    height: '6.75rem',
    width: '24rem',
    borderWidth: 1,
    borderRadius: 2,
    position:'absolute',
    bottom: 3,
    left:2,
    right: 2,
    backgroundColor:'transparent'
  }
});

@observer
export default class SeatIcon extends Component {
  propTypes: {
      checked : PropTypes.bool,
      enabled : React.PropTypes.bool,
      onCheckedChange: PropTypes.func,
      label: React.PropTypes.string,
      store: React.PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      enabled: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.checked !== this.props.checked) {
      this.setState(nextProps.checked);
    }
  }

  confirmToggle() {
      const prevState = this.state.checked;
      const newState = !prevState;

      this.setState({ checked: newState }, () => {
        this._emitCheckedChange(newState);
      });
  }

  _emitCheckedChange(checked) {
    if (this.props.onCheckedChange) {
      this.props.onCheckedChange(checked);
    }
  }

  render () {
    return (
      <TouchableWithoutFeedback onPress={() => {
        if (!this.props.enabled) {
          //Disable click
        } else {
          if (this.props.store.isMax){
            if (this.state.checked) {
              this.confirmToggle();
            }
          } else {
            this.confirmToggle();
          }
        }
      }}>
        <View style={[styles.outBox, {
          borderColor: this.props.enabled ? (
            this.state.checked ?
            'royalblue' : 'grey'
          ) : 'grey',
          backgroundColor: this.props.enabled ?
            (
              this.state.checked ?
              'rgba(66,141,250,0.3)' : 'transparent'
            ) :
              'rgba(223,223,223,0.3)'
        }]}>
        <Text style={{
          fontSize: 12,
          textAlign:'center',
          color: this.props.enabled ? (
            this.state.checked ?
            'royalblue' : 'grey'
          ) : 'grey',
          alignSelf:'center'
        }}>
          {this.props.label}
        </Text>
          <View style={[styles.insideBox, {
            borderColor: this.props.enabled ? (
              this.state.checked ?
              'royalblue' : 'grey'
            ) : 'grey'
          }]}>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}
