import { expect } from 'chai';
import { checkEquality } from './dumbArrayCheck';

describe('checking array equality', () => {
	it('should pass if two arrays have the same length', () => {
		expect(checkEquality([1,2], [3, 4])).to.be.equal(true);
	});
});