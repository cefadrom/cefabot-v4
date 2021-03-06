import { Request, Response } from 'express';
import Channel from '../../../../models/Channel';
import extractChannelRequestData from './helpers/extract-channel-request-data';

export default async function updateChannel(req: Request, res: Response) {

    const params = extractChannelRequestData(req, res);
    if (!params) return;

    const existingChannel = await Channel.findOne({
        botID: params.botID,
        guildID: params.guildID,
        channelType: params.channelType,
    });
    if (!existingChannel) {
        res.status(400).json({ error: 'Channel not found' });
        return;
    }

    await existingChannel.updateOne({
        $set: {
            channelID: params.channelID,
        },
    });

    res.json(params);

}
