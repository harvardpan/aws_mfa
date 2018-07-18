'use strict';

let config = {
  "duration"        : "900", // 15 minutes
  "profile"         : "<main aws profile>", // should be a named profile in ~/.aws/credentials
  "mfa_profile"     : "<mfa profile name>", // named profile in ~/.aws/credentials where mfa credentials should be written
  "aws account id"  : "<aws account id>", // the canonical aws account id
  "aws iam name"    : "<iam username>", // the iam user to use
  "token"           : "" // leave blank. will be asked when run
};

module.exports = config;