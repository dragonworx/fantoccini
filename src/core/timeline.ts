import { Ticker } from './ticker';

export class Timeline {
  ticker: Ticker;

  constructor() {
    this.ticker = new Ticker();
  }
}
