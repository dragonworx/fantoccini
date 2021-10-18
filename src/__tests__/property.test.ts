import { Property } from '../core/property';

describe('Property', () => {
  describe('Default Value', () => {
    it('Should set default value', () => {
      expect(new Property(5).defaultValue).toBe(5);
    });

    it('Should return default value if no frames at given frame index', () => {
      expect(new Property(10).get(1)).toBe(10);
    });
  });

  describe('Setting', () => {
    it('Should store the value for the given frame index', () => {
      expect(new Property(0).set(1, 5).get(1)).toBe(5);
    });
  });

  describe('Getting', () => {
    it('Should be empty with no frames set', () => {
      expect(new Property(0).isEmpty).toBeTruthy();
    });

    it('Should return the closest previous value for the given missing index', () => {
      const prop = new Property(0).set(1, 5).set(10, 6);
      expect(prop.get(2)).toBe(5);
      expect(prop.get(20)).toBe(6);
    });
  });
});
