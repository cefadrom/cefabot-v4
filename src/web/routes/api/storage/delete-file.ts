import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import verifyStoragePath from './verify-storage-path';

export default function deleteFile(req: Request, res: Response) {

    const storagePath = verifyStoragePath(req, res);

    if (!storagePath) return;

    if (typeof req.query.path !== 'string') {
        res.status(400).json({ error: 'Invalid query parameter "path"' });
        return;
    }

    const filePath = path.resolve(storagePath, req.query.path);
    if (!filePath.startsWith(storagePath)) {
        res.status(403).json({ error: 'The queried file is outside the bot storage location' });
        return;
    }

    if (!fs.existsSync(filePath)) {
        res.status(404).json({ error: 'Ressource not found' });
        return;
    }

    if (fs.statSync(filePath).isDirectory()) {
        console.log('dir', filePath);
        fs.rmdirSync(filePath, { recursive: true });
    } else {
        console.log('file', filePath);
        fs.unlinkSync(filePath);
    }

    res.sendStatus(200);

}
