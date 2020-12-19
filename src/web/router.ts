import { Router } from 'express';
import getsession from './routes/api/get-session';
import addTrustedAccount from './routes/api/global-settings/add-trusted-account';
import deleteTrustedAccount from './routes/api/global-settings/delete-trusted-account';
import getTrustedAccounts from './routes/api/global-settings/get-trusted-accounts';
import resetPassword from './routes/api/global-settings/reset-password';
import addStats from './routes/api/import-stats/add-stats';
import convertSQL from './routes/api/import-stats/convert-sql';
import connectRoute from './routes/connect';
import disconnectRoute from './routes/disconnect';
import bots from './routes/api/bots';
import getBot from './routes/api/bots/get-bot';
import patchBot from './routes/api/bots/patch-bot';
import commands from './routes/api/commands';
import events from './routes/api/events';
import reboot from './routes/api/bots/reboot';
import getMultipleData from './routes/api/data/get-multiple-data';
import guild from './routes/api/bots/guild';
import postData from './routes/api/data/post-data';
import deleteData from './routes/api/data/delete-data';
import createBot from './routes/api/bots/create-bot';
import { getWebAccesses } from './routes/api/web-accesses/get-web-accesses';
import getFilesList from './routes/api/storage/get-files-list';
import getFile from './routes/api/storage/get-file';
import deleteFile from './routes/api/storage/delete-file';
import getLogs from './routes/api/logs/get-logs';
import deleteLogs from './routes/api/logs/delete-logs';
import channelsList from './routes/api/channels/channels-list';
import addChannel from './routes/api/channels/add-channel';
import updateChannel from './routes/api/channels/update-channel';
import deleteChannel from './routes/api/channels/delete-channel';
import uploadFile from './routes/api/storage/upload-file';
import permanentRoute from './routes/permanent';

const connectionRouter = Router();

connectionRouter.get('/connect', connectRoute);
connectionRouter.get('/permanent', permanentRoute);
connectionRouter.get('/disconnect', disconnectRoute);

const apiRouter = Router();

// Disable cache for route
apiRouter.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

// Bot
apiRouter.get('/bots', bots);
apiRouter.post('/bots', createBot);
apiRouter.get('/bots/:id', getBot);
apiRouter.patch('/bots/:id', patchBot);
apiRouter.get('/bots/:id/reboot', reboot);
// Guild
apiRouter.get('/bots/:id/guild/:guild', guild);
// Commands
apiRouter.get('/commands', commands);
// Events
apiRouter.get('/events', events);
// Data
apiRouter.get('/data', getMultipleData);
apiRouter.post('/data', postData);
apiRouter.delete('/data/:dataID', deleteData);
// Web accesses
apiRouter.get('/web-accesses', getWebAccesses);
// Storage
apiRouter.get('/storage/:botID', getFilesList);
apiRouter.get('/storage/:botID/file', getFile);
apiRouter.delete('/storage/:botID/file', deleteFile);
apiRouter.post('/storage/:botID', uploadFile);
// Logs
apiRouter.get('/logs', getLogs);
apiRouter.delete('/logs', deleteLogs);
// Channels
apiRouter.get('/channels', channelsList);
apiRouter.post('/channels', addChannel);
apiRouter.patch('/channels', updateChannel);
apiRouter.delete('/channels', deleteChannel);
// Global settings
apiRouter.post('/reset-password', resetPassword);
apiRouter.get('/trusted-accounts', getTrustedAccounts);
apiRouter.post('/trusted-accounts', addTrustedAccount);
apiRouter.delete('/trusted-accounts', deleteTrustedAccount);
apiRouter.get('/session', getsession);
// Stats import
apiRouter.post('/import-stats/convert-sql', convertSQL);
apiRouter.post('/import-stats/add-stats', addStats);

export { connectionRouter, apiRouter };
