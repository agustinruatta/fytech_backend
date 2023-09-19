export default interface HTTPSerializableException {
  getHttpCode(): number;

  getErrorMessages(): string[];
}
