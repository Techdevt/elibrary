'use strict';
var secrets = require('./index.js').secrets;

module.exports = function seedDatabase(conn) {
    var User = require('../server/models/user').default(conn);
    var Admin = require('../server/models/admin').default(conn);
    var Address = require('../server/models/address').default(conn);

    var superAdmin = {
        username: 'Breezy',
        password: secrets["superAdmin:password"],
        firstName: 'Benjamin',
        lastName: 'Appiah-Brobbey',
        title: 'Mr.',
        address: 'P.O.Box 480, Kumasi',
        state: 'Ghana',
        location: 'Kumasi',
        email: 'fanky5g@gmail.com',
        permissions: [{
            name: 'adminAccounts',
            permit: true
        }, {
            name: 'userAccounts',
            permit: true
        }],
        avatarUrl: ['/images/gravatar.png']
    };

    User.find({}, function(err, users) {
        if (err) return;
        if (!users.length) {
            var address = {
                fullName: superAdmin.firstName + ' ' + superAdmin.lastName,
                addressLine1: superAdmin.address,
                postCode: '00233',
                country: 'Ghana',
                city: 'Accra',
                state: 'Greater Accra'
            };
            Address.create(address, function(err, ad) {
                if (!err) {
                    superAdmin.address = ad;
                    User.encryptPassword(superAdmin.password, function(err, hash) {
                        if (err) return;
                        superAdmin.password = hash;
                        User.create(superAdmin, function(err, user) {
                            ad.userId = user._id;
                            ad.save(function(err) {
                                superAdmin.user = user._id;
                                Admin.create(superAdmin, function(err, admin) {
                                    if (err) return;
                                    user.roles.admin = admin;
                                    user.save(function(err, user) {
                                        if (err) return;
                                        return true;
                                    })
                                });
                            });
                        });
                    });
                }
            });
        }
    });
};