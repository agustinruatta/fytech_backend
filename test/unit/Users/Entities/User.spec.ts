import { User } from '../../../../src/Users/Entities/User';
import { InvalidArgumentException } from '../../../../src/Shared/Exceptions/InvalidArgumentException';
import { Account } from '../../../../src/Account/Entities/Account';

describe('User', () => {
  describe('constructor', () => {
    const user = new User('test@gmail.com', 'password');

    it('set email correctly', () => {
      expect(user.getEmail()).toBe('test@gmail.com');
    });

    it('must save a hashed password', () => {
      expect(user['hashedPassword']).not.toBe('password');
      expect(typeof user['hashedPassword']).toBe('string');
    });

    it('returns the id', () => {
      expect(user.getId()).toBeUndefined();
    });
  });

  describe('isValidPassword', () => {
    it('is a valid password', () => {
      const user = new User('test@gmail.com', 'password');

      expect(user.isValidPassword('password')).toBe(true);
    });

    it('is not a valid password', () => {
      const user = new User('test@gmail.com', 'password');

      expect(user.isValidPassword('invalid')).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it('throws an exception if email is invalid', () => {
      expect(() => new User('invalid', 'password')).toThrow(
        new InvalidArgumentException('Invalid email', 'Invalid email'),
      );
    });
  });

  describe('serialize', () => {
    it('serializes an user object', () => {
      const user = new User('test@gmail.com', 'password');

      expect(user.serialize()).toStrictEqual({ email: 'test@gmail.com' });
    });
  });

  describe('addAccount', () => {
    it('adds a new account', async () => {
      const account = new Account('Some Name');

      const user = new User('test@gmail.com', 'password');
      await user.addAccount(account);

      expect(await user.accounts).toStrictEqual([account]);
    });
  });
});
