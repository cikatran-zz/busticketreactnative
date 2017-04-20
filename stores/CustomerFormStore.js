import {action, reaction, observable, observe, computed, autorun} from 'mobx';
import autobind from 'autobind-decorator';

@autobind
class CustomerFormStore {
  @observable amountOfSeat = 1;
  @observable showPickupPopup = false;
  @observable isMax = false;
  @observable isMin = true;
  @observable maxSeat = 4;

  @action chooseAmountSeat(type) {
    if (type == 0) {
      if(!this.isMin)
        this.decreaseSeat();
    } else {
      if (!this.isMax)
        this.increaseSeat();
    }
    this.isMax = (this.amountOfSeat > 3);
    this.isMin = (this.amountOfSeat < 2);
  }

  @action setMaxSeat(max) {
    this.maxSeat = max;
  }

  @action increaseSeat() {
    this.amountOfSeat ++;
  }

  @action decreaseSeat() {
    this.amountOfSeat --;
  }

  @action isShowPickupPopup(showPickupPopup){
    this.showPickupPopup = showPickupPopup;
  }
}
export default new CustomerFormStore();
