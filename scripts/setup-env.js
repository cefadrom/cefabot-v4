const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');
const prompts = require('prompts');
const kleur = require('kleur');

const questions = [
    {
        type: 'confirm',
        name: 'production',
        message: 'Is this environment a production environment?',
    },
    {
        type: 'confirm',
        name: 'genKey',
        message: 'Automatically generate the bot encryption key?',
    },
    {
        type: prev => prev === false ? 'password' : null,
        name: 'key',
        message: 'Custom bot encryption key',
        validate: input => input.match(/^[a-zA-Z0-9]{32}$/),
    },
    {
        type: 'text',
        name: 'dbURI',
        message: 'Database URI',
    },
    {
        type: 'text',
        name: 'storagePath',
        message: 'Storage path',
    },
    {
        type: 'text',
        name: 'webBaseUrl',
        message: 'Web panel base URL',
        validate: input => input.match(/^https?:\/\/[a-zA-Z0-9.-\/:]{1,80}$/),
    },
    {
        type: 'number',
        name: 'webPort',
        message: 'Web panel port',
        initial: 80,
        min: 1,
        max: 65536,
    },
];


const options = {
    onCancel: () => {
        console.warn(kleur.yellow('\nEnv setup cancelled.'));
        process.exit(0);
    }
};


(async () => {

    let res = await prompts(questions, options);

    if (res.genKey) {
        res.key = uuid()
            .replace(/-/g, '')
            .split('')
            .map(l => l.match(/\w/) && Math.random() < .6 ? l.toUpperCase() : l)
            .join('');
    }

    const envPath = path.resolve(__dirname, '../', '.env');

    fs.writeFileSync(envPath, `\
# General
NODE_ENV=${res.production ? 'prod' : 'dev'}

# Bots encryption key
BOT_KEY=${res.key}

# Database
DB_URI=${res.dbURI}

# Storage path, absolute or relative to the project root
STORAGE_PATH=${res.storagePath}

# The root URL of the web server (ex: http://host.ext, or https://192.168.1.2:8000)
WEB_BASE_URL=${res.webBaseUrl}
# The port of the web panel
WEB_PORT=${res.webPort}
`);

    console.log(kleur.green('\nSuccessfully saved the .env file!'));

})()
    .catch(console.error)
    .finally(() => process.exit(0));
