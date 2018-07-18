'use strict';

// This code will enable one to retrieve temporary credentials for an MFA
// enabled IAM user. It requests the token and then writes the temporary
// credentials to a profile defined in "config.mfa_profile".
// 
// Pre-Requisites
// 1. awscli command line utility is available and on the path
// 2. ~/.aws/credentials already exists
// 3. ~/.aws/credentials has the profile defined in config.profile

const { spawn, execSync } = require('child_process');
const readline = require('readline');

// Read in the Configuration
const config = require('./config-aws.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter MFA Token: ', (answer) => {
  config.token = answer;
  getSessionToken();
  rl.close();
});

/**
 * Retrieves the temporary credentials based on the configuration in config-aws.js.
 * Will then make a call to store the temporary credentials.
 */
function getSessionToken() {
  const aws_cmd = spawn('aws', [ 'sts', 'get-session-token',
                               '--duration-seconds', config.duration,
                               '--profile', config.profile,
                               '--serial-number', 'arn:aws:iam::' + config['aws account id'] + ':mfa/' + config['aws iam name'],
                               '--token', config.token
                              ]);

  let output_msg = "";
  let error_msg = "";

  aws_cmd.stdout.on('data', data => {
    output_msg = output_msg.concat(`${data}`);
  });        

  aws_cmd.stderr.on('data', data => {
    error_msg = error_msg.concat(`${data}`);
  });        

  aws_cmd.on('close', code => {
    const exit_code = `${code}`;
    if (exit_code !== '0') {
      console.log(error_msg);
      console.log(`ERROR: child process exited with code ${code}`);
      return;
    }
    let responseJSON = JSON.parse(output_msg);
    setAwsProfileParameter(config.mfa_profile, "aws_access_key_id", responseJSON.Credentials.AccessKeyId);
    setAwsProfileParameter(config.mfa_profile, "aws_secret_access_key", responseJSON.Credentials.SecretAccessKey);
    setAwsProfileParameter(config.mfa_profile, "aws_session_token", responseJSON.Credentials.SessionToken);    
    console.log("Success!");
  });
}

/**
 * Sets the parameter in the ~/.aws/credentials file. Used to set the temporary
 * credentials for MFA access to the AWS API
 *
 * @param {string} profileName the mfa profile that contains the temporary credentials.
 * @param {string} key one of aws_access_key_id, aws_secret_access_key, or aws_session_token
 * @param {string} value the value that the key's value should be set to
 */
function setAwsProfileParameter(profileName, key, value) {
  const aws_cmd = execSync(`aws configure set ${key} ${value} --profile ${profileName}`);
  console.log("On profile " + profileName + ", setting " + key + " to " + value);
}
