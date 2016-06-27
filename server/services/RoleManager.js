import typeOf from '../../shared/lib/typeof';
import Q from 'q';

let _roles = Symbol();
export default class RoleManager {
    constructor(roles) {
        this.setRoles(roles);
    }

    getRoles = () => {
        return this[_roles];
    };

    setRoles = (roles) => {
        if (typeof roles === "function") {
            this._setRoles = Q.nfcall(roles)
                .then(data => this.setRoles(data));
            return;
        }

        if (typeOf(roles) !== "object") {
            throw new Error('roles should be a JSON object');
        }
        this[_roles] = roles;

        let map = {};
        Object.keys(roles).forEach(role => {
            map[role] = {
                can: {}
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

        this[_roles] = map;
        this._inited = true;
        return true;
    };

    can = (role, operation, params, cb) => {

        if (!this._inited) {
            return this._setRoles
                .then(() => this.can(role, operation, params, cb));
        }

        if (typeof params === "function") {
            cb = params;
            params = undefined;
        }

        let callback = cb || function() {}.bind(this);

        return Q.Promise((resolvePromise, rejectPromise) => {

            const resolve = (result) => {
                resolvePromise(result);
                callback(undefined, result);
            };

            const reject = (err) => {
                rejectPromise(err);
                callback(err);
            };

            if (typeof role !== 'string') {
                throw new Error('Expected first parameter to be string : role');
            }

            if (typeof operation !== 'string') {
                throw new Error('Expected second parameter to be string: operation');
            }

            if (!this[_roles][role]) {
                return false;
            }

            let $role = this[_roles][role];

            if (!$role) {
                throw new Error('undefined role');
            }

            if (!$role.can[operation]) {

                if (!$role.inherits) {
                    return reject(false);
                }

                return Q.any($role.inherits.map(childRole => this.can(childRole, operation, params)))
                    .then(resolve, reject);
            }

            if ($role.can[operation] === 1) {
                return resolve(true);
            }

            if (typeof $role.can[operation] === "function") {
                $role.can[operation](params, function(err, result) {
                    if (err) {
                        return reject(err);
                    }

                    if (!result) {
                        return reject(false);
                    }

                    return resolve(true);
                });
            }

            if (!$role.inherits && $role.inherits.length < 1) {
                return false;
            }

            reject(false);
        });
    };
}
