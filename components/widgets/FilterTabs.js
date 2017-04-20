import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EStyleSheet from 'react-native-extended-stylesheet';
import stringres from '../../assets/string';
const FilterTabs = React.createClass({
  tabIcons: [],

  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array,
  },

  componentDidMount() {
    this._listener = this.props.scrollValue.addListener(this.setAnimationValue);
  },

  setAnimationValue({ value, }) {
    this.tabIcons.forEach((icon, i) => {
      const progress = (value - i >= 0 && value - i <= 1) ? value - i : 1;
      icon.setNativeProps({
        style: {
          color: this.iconColor(progress),
        },
      });
    });
  },

  //color between rgb(59,89,152) and rgb(204,204,204)
  iconColor(progress) {
    const red = 66 + (204 - 66) * progress;
    const green = 141 + (204 - 141) * progress;
    const blue = 250 + (204 - 250) * progress;
    return `rgb(${red}, ${green}, ${blue})`;
  },

  setTabName(tab) {
    if (tab === 'my-location') {
      return stringres.value.t('vxr_departure');
    } else if (tab === 'place') {
      return stringres.value.t('vxr_destination');
    } else if (tab === 'directions-bus') {
      return stringres.value.t('vxr_provider');
    } else {
      return stringres.value.t('vxr_departure_hour');
    }
  },

  render() {
    return <View style={[styles.tabs, this.props.style, ]}>
            <View style={styles.tabsContainer}>
            {this.props.tabs.map((tab, i) => {
              return <TouchableOpacity key={tab} onPress={() => this.props.goToPage(i)} style={styles.tab}>
                <View style={{flexDirection:'row'}}>
                <MaterialIcons
                  name={tab}
                  size={15}
                  color={this.props.activeTab === i ? 'rgb(66,141,250)' : 'rgb(204,204,204)'}
                  ref={(icon) => { this.tabIcons[i] = icon; }}
                />
                <Text style={{fontSize:12, marginLeft:2}} ref={(icon) => { this.tabIcons[i] = icon; }}>
                  {this.setTabName(tab)}
               </Text>
                </View>
              </TouchableOpacity>;
            })}
            </View>
          </View>;
  },
});

const styles = EStyleSheet.create({
  tab: {
    justifyContent: 'center',
  },
  tabs: {
    height: '45rem',
    flexDirection: 'row',
    paddingTop: '5rem',
    justifyContent:'center',
    alignItems:'center',
    width:'100%',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignSelf:'center',
    width:'90%',
    marginRight:'10rem',
    alignItems:'center'
  }
});

export default FilterTabs;
