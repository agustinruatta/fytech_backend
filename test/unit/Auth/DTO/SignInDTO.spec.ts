import SignInDTO from '../../../../src/Auth/DTO/SignInDTO';

describe('SignInDTO', () => {
  it('creates DTO correctly', () => {
    const dto = new SignInDTO();

    expect(dto).toBeDefined();
    expect(dto.email).toBeUndefined();
    expect(dto.password).toBeUndefined();
  });
});
