import chai from 'chai';
import chaiImmutable from 'chai-immutable';

chai.expect();
chai.use(chaiImmutable);

// (function() {
//   var child_process, clearDatabase, models, path, servers, startServer, stopServer;

//   path = require("path");

//   child_process = require("child_process");

//   models = require("../lib/models");

//   servers = {};

//   startServer = function(callback) {
//     var filepath, server;
//     process.env.PORT = Math.max(1000, 10000 - Math.round(Math.random() * 10000));
//     filepath = path.resolve(path.dirname(module.filename), "../app");
//     server = child_process.spawn("node", [filepath]);
//     server.stdout.on("data", function(data) {
//       var serverPath, str;
//       str = data.toString();
//       if (/listening on/.test(str)) {
//         serverPath = str.split(" ").pop().trim();
//         servers[serverPath] = server;
//         return callback(null, serverPath);
//       }
//     });
//     return server.stderr.on("data", function(data) {
//       var str;
//       str = data.toString();
//       console.error(str);
//       return callback(str);
//     });
//   };

//   stopServer = function(serverPath, callback) {
//     var server;
//     if (servers[serverPath]) {
//       server = servers[serverPath];
//       server.on('exit', function() {
//         return callback(null);
//       });
//       return server.kill();
//     } else {
//       return callback(null);
//     }
//   };

//   clearDatabase = function(callback) {
//     var clear, dbs, i, key, val;
//     i = 0;
//     dbs = [];
//     for (key in models) {
//       val = models[key];
//       dbs.push(val);
//     }
//     clear = function() {
//       if (!dbs[i]) {
//         return callback(null);
//       }
//       return dbs[i].remove(function(err) {
//         if (err) {
//           console.error(err);
//         }
//         i++;
//         return clear();
//       });
//     };
//     return clear();
//   };

//   module.exports = {
//     startServer: startServer,
//     stopServer: stopServer,
//     clearDatabase: clearDatabase
//   };

// }).call(this);