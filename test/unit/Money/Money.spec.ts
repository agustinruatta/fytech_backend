import Money from '../../../src/Money/Money';

describe('Money', () => {
  describe('newFromString', function () {
    it('should create it', () => {
      const money = Money.newFromString('$123', 'USD');

      expect(money).toBeDefined();
    });

    it('raises exception if invalid string', async () => {
      await expect(() => Money.newFromString('255.365.6', 'USD')).toThrow(
        new Error('Invalid amount'),
      );
    });
  });
});
