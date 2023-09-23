import HTTPSerializableException from './HTTPSerializableException';

export default class InvalidCredentialsException
  extends Error
  implements HTTPSerializableException
{
  getErrorMessages(): string[] {
    return ['Invalid email/password combination'];
  }

  getHttpCode(): number {
    return 401;
  }
}
