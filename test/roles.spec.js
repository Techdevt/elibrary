import { expect } from 'chai';
import RoleManager from '../server/services/RoleManager';
import sinon from 'sinon';

describe('RoleManager', function() {
    this.timeout(5000);
    const roles = {
        school: {
            can: ['publish'],
            inherits: ['lecturer']
        },
        faculty: {
            can: ['publish'],
            inherits: ['lecturer']
        },
        lecturer: {
            can: ['write'],
            inherits: ['student']
        },
        student: {
            can: ['read']
        }
    };

    let _RoleManager = new RoleManager(roles);

    it('getRoles() returns a set of roles', () => {
        const roles = _RoleManager.getRoles();
        expect(roles).to.exist;
        expect(roles).to.be.an('object');
    });

    describe('setRoles()', () => {
        it('accepts only JSON objects', () => {
            expect(_RoleManager.setRoles).to.not.be.undefined;
            const testArray = [];
            expect(_RoleManager.setRoles.bind(testArray)).to.throw('roles should be a JSON object');
        });

        it('successfully sets roles', () => {
            const returnValue = _RoleManager.setRoles(roles);
            expect(returnValue).to.equal(true);
        });
    });

    it("grant access to qualified users", (done) => {
        _RoleManager.can("school", "write").then((result) => {
            expect(result).to.equal(true);
            done();
        });
    });

    it("restricts access to unqualified users", (done) => {
        _RoleManager.can("school", "dance").catch(err => {
        	expect(err).to.equal(false);
            done();
        })
    });

    describe("roles with nested params", function() {
        it("setRoles(): sets roles accepts objects with nested tests", () => {
            let stub = sinon.stub();
            stub.returns(true);

            const _roles = Object.assign(roles, {
                lecturer: {
                    ...roles.lecturer,
                    can: [...roles.lecturer.can, {
                        name: 'edit',
                        when: stub
                    }]
                }
            });

            // expect(stub()).to.equal(true);
            const result = _RoleManager.setRoles(_roles);
            expect(result).to.equal(true);
        });

        it("can() accepts params to check against nested roles", (done) => {
            const params = {};
            _RoleManager.can("school", "write", {}).then((result) => {
                expect(result).to.equal(true);
                done();
            });
        });
    });

});
