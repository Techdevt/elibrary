import typeOf from '../../shared/lib/typeof';
import Q from 'q';

const roleData = Symbol();
export default class RoleManager {
  constructor(roles) {
    this.setRoles(roles);
  }

  getRoles = () => this[roleData];

  setRoles = (roles) => {
    if (typeof roles === 'function') {
      this.pSetRoles = Q.nfcall(roles)
        .then(data => this.setRoles(data));
      return;
    }

    if (typeOf(roles) !== 'object') {
      throw new Error('roles should be a JSON object');
    }
    this[roleData] = roles;

    const map = {};
    Object.keys(roles).forEach(role => {
      map[role] = {
        can: {},
      };

      if (roles[role].inherits) {
        map[role].inherits = roles[role].inherits;
      }

      roles[role].can.forEach(operation => {
        if (typeof operation === 'string') {
          map[role].can[operation] = 1;
        } else if (typeof operation.name === 'string' && typeof operation.when === 'function') {
          map[role].can[operation.name] = operation.when;
        }
      });
    });
    this[roleData] = map;
    this.inited = true;
  };

  clearRoles = () => {
    this[roleData] = null;
    if (this[roleData]) return false;
    return true;
  };

  can = (role, operation, params, cb) => {
    let $cb = cb;
    let $params = params;

    if (typeof params === 'function') {
      $cb = params;
      $params = undefined;
    }

    const callback = $cb || function fnCallback() {};

    if (!this.inited) {
      return this.pSetRoles
        .then(() => this.can(role, operation, $params, $cb));
    }

    return new Q.Promise((resolvePromise, rejectPromise) => {
      const resolve = (result) => {
        resolvePromise(result);
        callback(undefined, result);
      };
      const reject = (err) => {
        if (typeOf(err) === 'object') {
          rejectPromise(false);
          return callback(false);
        }
        rejectPromise(err);
        return callback(err);
      };
      if (typeof role !== 'string') {
        throw new Error('Expected first parameter to be string : role');
      }
      if (typeof operation !== 'string') {
        throw new Error('Expected second parameter to be string: operation');
      }
      if (!this[roleData][role]) {
        return reject(false);
      }
      const $role = this[roleData][role];
      if (!$role) {
        throw new Error('undefined role');
      }
      if (!$role.can[operation]) {
        if (!$role.inherits) {
          return reject(false);
        }
        return Q.any($role.inherits.map(childRole => this.can(childRole, operation, $params)))
          .then(resolve, reject);
      }
      if ($role.can[operation] === 1) {
        return resolve(true);
      }
      if (typeof $role.can[operation] === 'function') {
        $role.can[operation](params, (err, result) => {
          if (err) {
            return reject(err);
          }
          if (!result) {
            return reject(false);
          }
          return resolve(true);
        });
      }
      return reject(false);
    });
  };
}
