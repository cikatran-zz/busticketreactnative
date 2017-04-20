import {action, reaction, observable, observe, computed, autorun} from 'mobx';
import autobind from 'autobind-decorator';

@autobind
class SeatChoiceScreenStore {
  @observable selectedSeats = [];
  @observable totalPrice = 0;
  @observable isMax = false;
  @observable maxAmountOfSeat = 4;

  @action addSeat(seat) {
    this.selectedSeats.push(seat);
    this.totalPrice+= seat.price;
    this.isMax = this.selectedSeats.length > 3;
  }

  @action removeSeat(seat) {
    let newArray = this.selectedSeats.filter((e) => {
      let isSame = (e.seat_code === seat.seat_code);
      return !isSame;
    })
    this.totalPrice-= seat.price;
    this.selectedSeats = JSON.parse(JSON.stringify(newArray));
    this.isMax = this.selectedSeats.length > 3;
  }


  @computed get selectedSeatArray(){
    return this.selectedSeats.slice()
  }

  @action resetStore() {
    this.totalPrice = 0;
    this.selectedSeats = [];
    this.isMax = false;
  }

}
export default new SeatChoiceScreenStore()
