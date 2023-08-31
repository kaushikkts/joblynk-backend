import * as AWS from "aws-sdk";

export const getPassword = async() =>  {
        return new Promise((resolve, reject) => {
            const secretManager = new AWS.SecretsManager({region: 'us-east-1'});
            const key: any = 'MONGODB_DEV_PASSWORD';
            secretManager.getSecretValue({SecretId: key}, (err, data) => {
                if (err) {
                    reject(err);
                }
                let password;
                if (data === null || typeof data.SecretString !== "string") {
                    reject('No secret found. Please check your key');
                } else {

                    password = JSON.parse(data.SecretString)[key];
                    resolve(password);
                }
            })
        })
    }