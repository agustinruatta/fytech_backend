export class InvalidArgumentException
  extends Error
  implements HTTPSerializable
{
  private readonly friendlyMessage: string;

  constructor(message: string, friendlyMessage: string) {
    super(message);
    this.friendlyMessage = friendlyMessage;
  }

  getHttpCode(): number {
    return 400;
  }

  getErrorMessages(): string[] {
    return [this.friendlyMessage];
  }
}
