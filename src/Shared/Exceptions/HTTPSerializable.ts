interface HTTPSerializable {
  getHttpCode(): number;

  getErrorMessages(): string[];
}
