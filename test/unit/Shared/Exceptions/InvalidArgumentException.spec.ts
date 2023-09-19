import { InvalidArgumentException } from '../../../../src/Shared/Exceptions/InvalidArgumentException';

describe('InvalidArgumentException', () => {
  it('returns correct data', () => {
    const exception = new InvalidArgumentException(
      'error message',
      'friendly message',
    );

    expect(exception.getHttpCode()).toBe(400);
    expect(exception.getErrorMessages()).toStrictEqual(['friendly message']);
  });
});
