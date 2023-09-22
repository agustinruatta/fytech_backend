import InvalidCredentialsException from '../../../../src/Shared/Exceptions/InvalidCredentialsException';

describe('InvalidCredentialsException', () => {
  it('returns correct data', () => {
    const exception = new InvalidCredentialsException();

    expect(exception.getHttpCode()).toBe(401);
    expect(exception.getErrorMessages()).toStrictEqual([
      'Invalid email/password combination',
    ]);
  });
});
