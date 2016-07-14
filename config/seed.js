'use strict';
import { secrets } from './index';

module.exports = function seedDatabase(conn) {
  /* eslint global-require: "off" */
  const User = require('../server/models/user').default(conn);
  const Admin = require('../server/models/admin').default(conn);
  const Address = require('../server/models/address').default(conn);

  const superAdmin = {
    username: 'Breezy',
    password: secrets['superAdmin:password'],
    firstName: 'Benjamin',
    lastName: 'Appiah-Brobbey',
    title: 'Mr.',
    address: 'P.O.Box 480, Kumasi',
    state: 'Ghana',
    location: 'Kumasi',
    email: 'fanky5g@gmail.com',
    permissions: [{
      name: 'adminAccounts',
      permit: true,
    }, {
      name: 'userAccounts',
      permit: true,
    }],
    avatarUrl: ['/images/gravatar.png'],
  };

  User.find({}, (err, users) => {
    if (err) return debug.log(err);
    if (!users.length) {
      const address = {
        fullName: `${superAdmin.firstName} ${superAdmin.lastName}`,
        addressLine1: superAdmin.address,
        postCode: '00233',
        country: 'Ghana',
        city: 'Accra',
        state: 'Greater Accra',
      };
      Address.create(address, (addressCreateError, ad) => {
        if (!addressCreateError) {
          superAdmin.address = ad;
          User.encryptPassword(superAdmin.password, (passEncryptError, hash) => {
            if (passEncryptError) return debug.log(passEncryptError);
            superAdmin.password = hash;
            return User.create(superAdmin, (userCreateError, user) => {
              ad.userId = user._id;
              return ad.save(() => {
                superAdmin.user = user._id;
                return Admin.create(superAdmin, (adminCreateError, admin) => {
                  if (adminCreateError) return debug.log(adminCreateError);
                  user.roles.admin = admin;
                  return user.save((saveError) => {
                    if (err) return debug.log(saveError);
                    return true;
                  });
                });
              });
            });
          });
        }
        return true;
      });
    }
    return true;
  });
};
