export class GetCurrentMarketDataResponse {
  private readonly value: number;

  private readonly date: Date;

  constructor(value: number, date: Date) {
    this.value = value;
    this.date = date;
  }

  getValue(): number {
    return this.value;
  }

  getDate(): Date {
    return this.date;
  }
}
