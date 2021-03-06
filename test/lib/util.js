var concat = require('concat-stream');
var Promise = require('bluebird');

function redirectsTo(opt_status, path) {
  var args = Array.prototype.slice.call(arguments);
  return function(req, res) {
    res.redirect.apply(res, args);
  };
}

function sendsJson(json) {
  return function(req, res) {
    res.json(json);
  };
}

function concatJson(resolve, reject) {
  return function(res) {
    res.pipe(concat({encoding:'string'}, function(string){
      try {
        res.parsedJson = JSON.parse(string);
        resolve(res);
      } catch (e) {
        reject(new Error('error parsing ' + JSON.stringify(string) + '\n caused by: ' + e.message));
      }
    })).on('error', reject);
  };
}

function asPromise(cb) {
  return function(result) {
    return new Promise(function(resolve, reject) {
      cb(resolve, reject, result);
    });
  };
}

module.exports = {
  redirectsTo: redirectsTo,
  sendsJson: sendsJson,
  concatJson: concatJson,
  asPromise: asPromise
};
