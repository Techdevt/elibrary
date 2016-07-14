import { expect } from 'chai';
import RoleManager from '../server/services/RoleManager';
import sinon from 'sinon';

describe('RoleManager', function testRoles() {
  this.timeout(5000);
  const roles = {
    school: {
      can: ['publish'],
      inherits: ['lecturer'],
    },
    faculty: {
      can: ['publish'],
      inherits: ['lecturer'],
    },
    lecturer: {
      can: ['write'],
      inherits: ['student'],
    },
    student: {
      can: ['read'],
    },
  };

  const RoleManagerInstance = new RoleManager(roles);

  it('getRoles() returns a set of roles', () => {
    const localRoles = RoleManagerInstance.getRoles();
    expect(localRoles).to.exist();
    expect(localRoles).to.be.an('object');
  });

  describe('setRoles()', () => {
    it('accepts only JSON objects', () => {
      expect(RoleManagerInstance.setRoles).to.not.be.undefined();
      const testArray = [];
      expect(RoleManagerInstance.setRoles.bind(this, testArray))
        .to.throw('roles should be a JSON object');
    });

    it('clears roles successfully', () => {
      const rolesCleared = RoleManagerInstance.clearRoles();
      expect(rolesCleared).to.equal(true);
    });

    it('successfully sets roles', () => {
      RoleManagerInstance.clearRoles();
      RoleManagerInstance.setRoles(roles);
      const newRoles = RoleManagerInstance.getRoles();
      expect(newRoles).to.not.be.undefined();
    });
  });

  it('grant access to qualified users', (done) => {
    RoleManagerInstance.can('school', 'write').then((result) => {
      expect(result).to.equal(true);
      done();
    });
  });

  it('restricts access to unqualified users', (done) => {
    RoleManagerInstance.can('school', 'dance').catch(err => {
      expect(err).to.equal(false);
      done();
    });
  });

  describe('roles with nested params', () => {
    before(() => {
      RoleManagerInstance.clearRoles();
    });

    it('setRoles(): sets roles accepts objects with nested tests', () => {
      const stub = sinon.stub();
      stub.returns(true);

      const roles2 = Object.assign(roles, {
        lecturer: {
          ...roles.lecturer,
          can: [...roles.lecturer.can, {
            name: 'edit',
            when: stub,
          }],
        },
      });

      // expect(stub()).to.equal(true);
      RoleManagerInstance.setRoles(roles2);
      const newRoles = RoleManagerInstance.getRoles();
      expect(newRoles).to.not.be.undefined();
    });

    it('can() accepts params to check against nested roles', (done) => {
      RoleManagerInstance.can('school', 'write', {}).then((result) => {
        expect(result).to.equal(true);
        done();
      });
    });
  });
});
