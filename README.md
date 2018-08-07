# aws_mfa
Configures local AWS credentials file with temporary access keys for MFA-enabled IAM users

This code will enable one to retrieve temporary credentials for an MFA
enabled IAM user. It requests the token and then writes the temporary
credentials to a profile defined in "config.mfa_profile".
 
### Pre-Requisites
1. awscli command line utility is available and on the path
2. ~/.aws/credentials already exists
3. ~/.aws/credentials has the profile defined in config.profile

### Installation Instructions
* Clone the Git repository
```git clone https://github.com/harvardpan/aws_mfa```
* Edit the aws_mfa/config-aws.js file, with the following content:
```
let config = {
  "duration"        : "900", // 15 minutes
  "profile"         : "<main aws profile>", // should be a named profile in ~/.aws/credentials
  "mfa_profile"     : "<mfa profile name>", // named profile in ~/.aws/credentials where mfa credentials should be written
  "aws account id"  : "<aws account id>", // the canonical aws account id
  "aws iam name"    : "<iam username>", // the iam user to use
  "token"           : "" // leave blank. will be asked when run
};
```
* Replace "\<main aws profile\>" with your iam profile name
* Replace "\<mfa profile name\>" with a new profile name (eg. mfa)
* Replace "\<aws account id\>" with the numerical AWS account id. You can find this in your canonical name (eg. 1234567890)
* Replace "\<iam username\>" with the actual iam user that you use
* Invoke the process to capture your temporary credentials. It will store the temp creds in your credentials file.

```node index.js```
* Launch your aws commands, specifying the mfa profile

```aws s3 ls --profile mfa```
