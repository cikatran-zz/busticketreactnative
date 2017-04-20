import {action, reaction, observable, observe, computed, autorun} from 'mobx';
import autobind from 'autobind-decorator';

@autobind
class VexereMainStore {
  @observable newDate = '';
  @observable history = [];
  @observable isShownIOSDatePicker = false;

  @action setNewDate(newDate) {
    this.newDate = newDate;
  }

  @action setHistory(history) {
    this.history = history;
  }
  @action setShownIOSDatePicker(isShownIOSDatePicker) {
    this.isShownIOSDatePicker = isShownIOSDatePicker;
  }
}
export default new VexereMainStore();
