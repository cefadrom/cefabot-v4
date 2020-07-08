import { Request, Response } from 'express';
import WebPanelAccess from '../../models/WebPanelAccess';
import ms from 'ms';

const TOKEN_EXPIRE_DURATION = ms('1m');

export default async function connectRoute(req: Request, res: Response) {

    const token = req.query.token as string | undefined;
    if (!token) {
        res.status(400).send('Please supply a token');
        return;
    }

    const access = await WebPanelAccess.findOne({ token });

    if (!access) {
        res.status(401).send('Invalid token');
        return;
    }

    if (access.connected || access.created.getTime() + TOKEN_EXPIRE_DURATION < Date.now()) {
        res.status(401).send('Expired token');
        return;
    }

    await access.updateOne({ connected: true, ip: req.ip });

    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' }).redirect('/app');
}
