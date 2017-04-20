import {action, reaction, observable, observe, computed, autorun} from 'mobx';
import autobind from 'autobind-decorator';
import { ListView } from 'react-native';

@autobind
class BookingScreenStore {
  @observable sort = 0;
  @observable ratingShow = false;
  @observable ratingIndex = 0;
  @observable isShownIOSDatePicker = false;

  @action setSort(sort) {
    this.sort = sort;
  }

  @action setRatingShow(ratingShow) {
    this.ratingShow = ratingShow;
  }

  @action setRatingIndex(ratingIndex) {
    this.ratingIndex = ratingIndex;
  }

  @action setShownIOSDatePicker(isShownIOSDatePicker) {
    this.isShownIOSDatePicker = isShownIOSDatePicker;
  }
}
export default new BookingScreenStore();
