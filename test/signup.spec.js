import { validate } from '../server/controllers/Signup';
import { expect } from 'chai';
import sinon from 'sinon';

describe("Signup Controller", function() {
	it("validates user fields by passed keys", () => {
		const user = {
			username: 'Breezy'
		};
		
		const requiredFields = ['username', 'password'];
		expect(validate.bind(this, user, requiredFields)).to.throw('validation error: password field is required');
	});

	// it("allows schools to register under unique domains", () => {
	// 	const school = {
	// 		name: "knust",
	// 		domain: "knust"
	// 	};
	// });
});