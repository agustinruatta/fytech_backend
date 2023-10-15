import { Account } from '../../../../src/Account/Entities/Account';

describe('Account', () => {
  describe('constructor', () => {
    const account = new Account('John Williams');

    it('set name correctly', () => {
      expect(account.getName()).toBe('John Williams');
    });

    it('returns the id', () => {
      expect(account.getId()).toBeUndefined();
    });
  });

  describe('serialize', () => {
    it('serializes an user object', async () => {
      const account = new Account('Peter Johnson');

      expect(await account.serialize()).toStrictEqual({
        name: 'Peter Johnson',
      });
    });
  });
});
