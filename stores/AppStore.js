import { observable, autorun, action, computed } from 'mobx'
import autobind from 'autobind-decorator';

@autobind
class AppStore {
  @observable startLocation = {};
  @observable stopLocation = {};
  @observable typeOfLocation = 0;
  @observable bookingDate = '';
  @observable pickupLocation = '';
  @observable filterFromLocation = [];
  @observable filterToLocation = [];
  @observable filterCompanyName = [];
  @observable filterDepartureTime = [];
  @observable tripArray = [];
  @observable originalTripArray = [];

  @action
  setTypeOfLocation(typeOfLocation) {
    this.typeOfLocation = typeOfLocation;
  }

  @action
  setStartLocation(startLocation) {
    this.startLocation = Object.assign({}, startLocation);
  }

  @action
  setStopLocation(stopLocation) {
    this.stopLocation = Object.assign({}, stopLocation);
  }

  @action
  setBookingDate(bookingDate) {
    this.bookingDate = bookingDate;
  }

  @action
  setPickupLocation(pickupLocation) {
    this.pickupLocation = pickupLocation;
  }

  @action
  setFilterFromLocation(filterFromLocation) {
    this.filterFromLocation = JSON.parse(JSON.stringify(filterFromLocation));
  }

  @action
  setFilterToLocation(filterToLocation) {
    this.filterToLocation = JSON.parse(JSON.stringify(filterToLocation));
  }

  @action
  setFilterCompanyName(filterCompanyName) {
    this.filterCompanyName = JSON.parse(JSON.stringify(filterCompanyName));
  }

  @action
  setFilterDepartureTime(filterDepartureTime) {
    this.filterDepartureTime = JSON.parse(JSON.stringify(filterDepartureTime));
  }

  @action setTrips(tripArray) {
    this.tripArray = JSON.parse(JSON.stringify(tripArray));
  }

  @action setOriginalTrips(originalTripArray) {
    this.originalTripArray = JSON.parse(JSON.stringify(originalTripArray));
  }

  @computed get dataSource() {
    return this.tripArray.slice();
  }

  @computed get filterFromLocationArray() {
    return this.filterFromLocation.slice();
  }

  @computed get filterToLocationArray() {
    return this.filterToLocation.slice();
  }

  @computed get filterCompanyNameArray() {
    return this.filterCompanyName.slice();
  }

  @computed get filterDepartureTimeArray() {
    return this.filterDepartureTime.slice();
  }

}

const appStore = new AppStore();
const typeOfLocationEnum = Object.freeze({START: 0, STOP: 1});

autorun(() => {
  console.log(appStore)
})

export default appStore
