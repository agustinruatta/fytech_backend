import { User } from '../../../../src/Users/entities/User';

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
});
