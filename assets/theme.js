import {Platform, Dimensions, PixelRatio} from 'react-native';

let {height, width} = Dimensions.get('window');

let scale = ((width/320)+(height/640))/2.00;
export default {
  rem: scale,
  mainBlue: '#428dfa',
  lightGrey: '#cccccc',
  toolbarHeight: (Platform.OS === 'ios' ) ? height*0.11 : '56rem',
  locationReChooseBarHeight: height*0.10,
  backIcon: (Platform.OS === 'ios' ) ? "ios-arrow-back" : "md-arrow-back",
}
