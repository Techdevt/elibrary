'use strict';

import mongoose from 'mongoose';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';

function sendPasswordResetMail() {
  return;
}

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  password: String,
  email: {
    type: String,
    unique: true,
  },
  roles: {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      autopopulate: true,
    },
  },
  isActive: Boolean,
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  address: { type: [mongoose.Schema.Types.ObjectId], ref: 'Address', autopopulate: true },
});

UserSchema.methods.canPlayRoleOf = (role) => {
  if (role === 'admin' && this.roles.admin) {
    return true;
  }

  return false;
};

UserSchema.statics.initiatePasswordReset = (req, res, fields) => {
  mongoose.model('User').findOne(fields, (err, user) => {
    if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);

    if (!user) {
      return res.status(httpStatus.BAD_REQUEST).send('Corresponding user not found in system');
    }

    return mongoose.model('User').createVerificationToken((tokenError, token, hash) => {
      const d = new Date();

      user.resetPasswordToken = token;
      user.resetPasswordExpires = d.setDate(d.getDate() + 2);
      return user.save((error) => {
        if (error) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
        return sendPasswordResetMail(req, res, {
          to: user.email,
          userId: user._id,
          resetToken: hash,
        }).then(() => res.status(httpStatus.OK).send({
          message: 'success',
        }), mailError => res.status(httpStatus.BAD_REQUEST).send(mailError));
      });
    });
  });
};

function verifyPasswordPermission(params, user) {
  let verificationPass = false;
  return new Promise((resolve, reject) => {
    if (params.hasOwnProperty('isAdminResetPassword') && params.isAdminResetPassword === true) {
      // skip verificationToken inspection
      verificationPass = true;
      return resolve(verificationPass);
    }
    return mongoose.model('User')
      .validatePassword(user.resetPasswordToken, params.hash, (err, result) => {
        if (err || !result) {
          verificationPass = false;
          return reject(verificationPass);
        }
        verificationPass = true;
        return resolve(verificationPass);
      });
  });
}

UserSchema.statics.resetPassword = (params, done) => {
  mongoose.model('User').findOne({
    _id: params.id,
  }, (err, user) => {
    if (err) return done(err);
    if (!user) return done('Matching account not found');

    return mongoose.model('User')
      .validatePassword(params.newPass, user.password, (passwordValidateError, result) => {
        if (passwordValidateError) return done('Internal Server Error');
        if (result) {
          return done('New password cannot be equal to previously used passwords');
        }

        return verifyPasswordPermission(params, user).then((verifyPassPermissionResult) => {
          if (verifyPassPermissionResult) {
            const d = new Date();

            if (!params.hasOwnProperty('isAdminResetPassword')) {
              if ((user.resetPasswordExpires - d) < 0) return done('Token Expired');
            }

            return mongoose.model('User').encryptPassword(params.newPass, (encryptError, hash) => {
              if (encryptError) return done(encryptError);
              user.password = hash;
              return user.save((saveError) => {
                if (saveError) return done(saveError);
                return done(null, {
                  message: 'password_reset_success',
                });
              });
            });
          }
          return done('Password Reset Failed!!! Token mismatch');
        }, verifyPassPermissionError => done(verifyPassPermissionError));
      });
  });
};

UserSchema.statics.createVerificationToken = (done) => {
  crypto.randomBytes(21, (err, buf) => {
    const token = buf.toString('hex');
    if (err) {
      return done(err);
    }
    return mongoose.model('User').encryptPassword(token, (encryptError, hash) => {
      if (encryptError) return done(encryptError);
      return done(null, token, hash);
    });
  });
};

UserSchema.statics.encryptPassword = (password, done) => {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return done(err);
    }

    return bcrypt.hash(password, salt, (hashError, hash) => {
      if (hashError) return done(hashError);
      return done(null, hash);
    });
  });
};

UserSchema.statics.validatePassword = (password, hash, done) => {
  bcrypt.compare(password, hash, (err, res) => {
    if (err) return done(err);
    return done(null, res);
  });
};

const db = connection => connection.model('User', UserSchema);

export default db;
