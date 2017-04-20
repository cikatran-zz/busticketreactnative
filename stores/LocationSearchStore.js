import {action, reaction, observable, observe, computed, autorun} from 'mobx';
import autobind from 'autobind-decorator';

@autobind
class LocationSearchStore {
  @observable departures = [];
  @observable destinations = [];

  @action setDepartures(departures) {
    this.departures = JSON.parse(JSON.stringify(departures));
  }

  @action setDestinations(destinations) {
    this.destinations = JSON.parse(JSON.stringify(destinations));
  }
  @computed get departureArray(){
    return this.departures.slice()
  }
  @computed get destinationArray(){
    return this.destinations.slice()
  }
}
export default new LocationSearchStore();
