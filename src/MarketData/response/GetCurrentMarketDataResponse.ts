export class GetCurrentMarketDataResponse {
  private value: number;

  private date: Date;

  constructor(value: number, date: Date) {
    this.value = value;
    this.date = date;
  }
}
