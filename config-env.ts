// Creates Angular environment.ts and environment.prod.ts files from the environment variables
//from https://medium.com/@ferie/how-to-pass-environment-variables-at-building-time-in-an-angular-application-using-env-files-4ae1a80383c

const fs = require('fs');   //was an import statement

// Configure Angular `environment.ts` file path
const targetPath = './src/environments/environment.ts';
const targetProdPath = './src/environments/environment.prod.ts';

// Load node modules
const colors = require('colors');
require('dotenv').config();   //was .load()

const buildConfig = (production: boolean) => {
    return  `export const environment = {
        appName: '${process.env["APP_NAME"]}',
        appScope: '${process.env["APP_SCOPE"]}',
        os_url: '${process.env["OS_URL"]}',
        os_secret: '${process.env["OS_SECRET"]}',
        google_api: '${process.env["GOOGLE_API"]}',
        auth_url: '${process.env["AUTH_URL"]}',
        auth_registration_code: '${process.env["AUTH_REGISTRATION_CODE"]}',
        platform: '${process.env["PLATFORM"]}',
        production: ${process.env["PRODUCTION"] || production},
        mock: ${process.env["MOCK"] === 'true' || false}
     };
     `;
};

// `environment.ts` file structure
const envConfigFile = buildConfig(false);
const envProdConfigFile = buildConfig(true);

//environment.ts log setup
console.log(colors.magenta('The file `environment.ts` will be written with the following content: \n'));
console.log(colors.grey(envConfigFile));

//write the file
fs.writeFile(targetPath, envConfigFile, (err: any) => {
   if (err) {
       throw console.error(err);
   } else {
       console.log(colors.magenta(`Angular environment.ts file generated correctly at ${targetPath} \n`));
   }
});

//environment.prod.ts log setup
console.log(colors.magenta('The file `environment.prod.ts` will be written with the following content: \n'));
console.log(colors.grey(envProdConfigFile));

//write the file
fs.writeFile(targetProdPath, envProdConfigFile, (err: any) => {
   if (err) {
       throw console.error(err);
   } else {
       console.log(colors.magenta(`Angular environment.prod.ts file generated correctly at ${targetProdPath} \n`));
   }
});

//done
