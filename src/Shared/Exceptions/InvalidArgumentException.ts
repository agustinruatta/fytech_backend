import HTTPSerializableException from './HTTPSerializableException';

export class InvalidArgumentException
  extends Error
  implements HTTPSerializableException
{
  private readonly friendlyMessage: string;

  constructor(message: string, friendlyMessage: string) {
    super(message);
    this.friendlyMessage = friendlyMessage;
  }

  getHttpCode(): number {
    return 422;
  }

  getErrorMessages(): string[] {
    return [this.friendlyMessage];
  }
}
