import { validate, genVerificationToken, registerClient } from '../server/controllers/Signup';
import { expect } from 'chai';

describe("Signup Controller", function() {
	it("ensures all required user fields are passed", () => {
		const user = {
			username: 'Breezy'
		};
		
		const requiredFields = ['username', 'password'];
		expect(validate.ensure.bind(this, user, requiredFields)).to.throw('validation error: password field is required');
	});

	it("genVerificationToken() creates a random verification string", (done) => {
		genVerificationToken((err, hash) => {
			expect(hash).to.not.be.undefined;
			expect(hash).to.not.be.empty;
			expect(hash).to.be.a("string");
			done();
		});
	});

	describe("Client Account Registration", function() {
		it("client domains must be a one word string", (done) => {
			const user = {
				domain: "knust university",
				password: "******",
				email: "knust@gmail.com"
			};

			registerClient(user, (err, result) => {
				expect(err).to.not.be.undefined;
				expect(err.message).to.equal("validation error: domain must be one word");
				done();
			});
		});
	});

	// describe("Registration", function() {
	// 	it("allows schools to register under unique domains", () => {
	// 		const school = {
	// 			name: "knust",
	// 			domain: "knust"
	// 		};
	// 	});

	// 	it("generates account verification tokens", () => {

	// 	});
	// });
});