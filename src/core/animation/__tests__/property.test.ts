import { NumericProperty } from '../property';

describe('Property', () => {
  describe('Numeric Property', () => {
    describe('Max', () => {
      it('Should not apply max if not set', () => {
        expect(new NumericProperty().set(100).get()).toBe(100);
      });
      it('Should apply max if set', () => {
        expect(new NumericProperty(0, 0, 10).set(100).get()).toBe(10);
      });
    });

    describe('Min', () => {
      it('Should not apply min if not set', () => {
        expect(new NumericProperty().set(-100).get()).toBe(-100);
      });
      it('Should apply min if set', () => {
        expect(new NumericProperty(0, -10).set(-100).get()).toBe(-10);
      });
    });
  });
});
