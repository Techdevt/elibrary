'use strict';

import mongoose from 'mongoose';
import crypto from 'crypto';

let UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: String,
    email: {
        type: String,
        unique: true
    },
    roles: {
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
            autopopulate: true
        }
    },
    isActive: Boolean,
    dateCreated: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    address: { type: [mongoose.Schema.Types.ObjectId], ref: 'Address', autopopulate: true }
});

UserSchema.methods.canPlayRoleOf = (role) => {
    if (role === 'admin' && this.roles.admin) {
        return true;
    }

    return false;
};

UserSchema.statics.initiatePasswordReset = (req, res, fields) => {
    mongoose.model('User').findOne(fields, function(err, user) {
        if (err) return done(err);

        if (!user) {
            return res.status(httpStatus.BAD_REQUEST).send('Corresponding user not found in system');
        }
        mongoose.model('User').createVerificationToken(function(err, token, hash) {
            let d = new Date();

            user.resetPasswordToken = token;
            user.resetPasswordExpires = d.setDate(d.getDate() + 2);
            user.save(function(err, retUser) {
                if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
                sendPasswordResetMail(req, res, {
                    to: user.email,
                    userId: user._id,
                    resetToken: hash
                }).then(function(result) {
                    res.status(httpStatus.OK).send({
                        message: 'success'
                    });
                }, function(err) {
                    return res.status(httpStatus.BAD_REQUEST).send(err);
                });
            });
        });
    });
};

UserSchema.statics.resetPassword = function(params, done) {
    mongoose.model('User').findOne({
        _id: params.id
    }, function(err, user) {
        if (err) return done(err);
        if (!user) return done('Matching account not found');

        mongoose.model('User').validatePassword(params.newPass, user.password, function(err, result) {
            if (err) return done('Internal Server Error');
            if (result) {
                return done('New password cannot be equal to previously used passwords');
            } else {

                function verifyPasswordPermission() {
                    let verificationPass = false;
                    return new Promise(function(resolve, reject) {
                        if (params.hasOwnProperty('isAdminResetPassword') && params.isAdminResetPassword == true) {
                            //skip verificationToken inspection
                            verificationPass = true;
                            return resolve(verificationPass);
                        } else {
                            mongoose.model('User').validatePassword(user.resetPasswordToken, params.hash, function(err, result) {
                                if (err || !result) {
                                    verificationPass = false;
                                    return reject(verificationPass);
                                }
                                verificationPass = true;
                                return resolve(verificationPass);
                            });
                        }
                    });
                }

                verifyPasswordPermission().then(function(result) {
                    if (result) {
                        let d = new Date();

                        if (!params.hasOwnProperty('isAdminResetPassword')) {
                            if ((user.resetPasswordExpires - d) < 0) return done('Token Expired');
                        }

                        mongoose.model('User').encryptPassword(params.newPass, function(err, hash) {
                            if (err) return done(err);
                            user.password = hash;
                            user.save(function(err, updatedUser) {
                                if (err) return done(err);
                                return done(null, {
                                    message: 'password_reset_success'
                                });
                            });
                        });

                    } else {
                        return done('Password Reset Failed!!! Token mismatch');
                    }
                }, function(err) {
                    return done(err);
                });
            }
        });
    });
};

UserSchema.statics.createVerificationToken = function(done) {
    crypto.randomBytes(21, function(err, buf) {
        if (err) {
            return done(err);
        }

        var token = buf.toString('hex');
        mongoose.model('User').encryptPassword(token, function(err, hash) {
            if (err) return done(err);
            done(null, token, hash);
        });
    });
};

UserSchema.statics.encryptPassword = function(password, done) {
    var bcrypt = require('bcrypt');

    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return done(err);
        }

        bcrypt.hash(password, salt, function(err, hash) {
            done(err, hash);
        });
    });
};

UserSchema.statics.validatePassword = (password, hash, done) => {
    var bcrypt = require('bcrypt');
    bcrypt.compare(password, hash, function(err, res) {
        done(err, res);
    });
};

const db = connection => connection.model('User', UserSchema);

export default db;