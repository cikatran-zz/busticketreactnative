'use strict';
import React, {Component} from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Image, View, Animated} from 'react-native';
import THEME from '../../assets/theme';
const styles = EStyleSheet.create({
  spinner: {
    transform: [{rotate:'180deg'}],
    marginTop:'7rem',
    marginRight: '2rem'
  }
});
let Spinner = require('react-native-spinkit');
export default class BusLoading extends Component {

  propTypes: {
    isLoading: React.PropTypes.boolean;
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      slidingAnimationValue: new Animated.Value(0)
    };
  }

  _initView(isLoading) {
    this.setState({ isLoading: isLoading });
  }

  componentWillMount() {
    this._initView(this.props.isLoading);
    this.runningAnimation();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isLoading !== this.props.isLoading) {
      this._initView(nextProps.isLoading)
    }
  }

  runningAnimation() {
    let ANIMATION_END_Y = 2;
    let NEGATIVE_END_Y = -1;
    const animationConfig = {
      duration: 350,
      toValue: NEGATIVE_END_Y,
      isInteraction: false
    };

    const animationConfig2 = {
      duration: 350,
      toValue: ANIMATION_END_Y,
      isInteraction: false
    };
    const value = this.state.slidingAnimationValue;
    Animated.sequence([
      Animated.timing(value, {
        ...animationConfig
      }),
      Animated.timing(value, {
          ...animationConfig2
        }),
    ]).start(() => {
      if(this.state.isLoading) this.runningAnimation();
    });
  }

  // componentDidMount() {
  //   this.runningAnimation();
  // }

  render() {

    return (
      <View style={{flexDirection:'row'}}>
        <Spinner
          style={styles.spinner}
          size={30} type={'ThreeBounce'}
          color={`${THEME.mainBlue}`}/>
        <Animated.Image
          style={{transform: [                        // `transform` is an ordered array
            {translateY: this.state.slidingAnimationValue},  // Map `bounceValue` to `scale`
          ]}}
          source={require('../../assets/images/img_loading_bus.png')}/>
      </View>
    );
  }
}
