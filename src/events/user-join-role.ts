import { BotEvent, EventCancel, EventRun } from './events';
import { GuildMember, PartialGuildMember } from 'discord.js';
import { BotInstance } from '../bot/botTypes';
import getData from './helper/get-data';
import { DataStorage } from '../models/DataModel';
import UserStatsModel from '../models/UserStatsModel';
import botLog from '../logs/bot-log';


let botInstance: BotInstance | undefined = undefined;
let data: undefined | DataStorage[] = undefined;


async function userJoin(member: GuildMember | PartialGuildMember) {

    const userData = await UserStatsModel.findOne({
        botID: botInstance!.config._id,
        guildID: member.guild.id,
        userID: member.id,
    });

    if (userData) return;

    const roleID = data!.find(d => d.key === 'new-member-role-id')!.value;
    const role = member
        .guild
        .roles
        .resolve(roleID);

    if (!role) {
        return await botLog(
            'error',
            `Impossible de trouver le role ${roleID} et de l'ajouter à ${member.displayName}`,
            botInstance!.config._id,
            { location: 'user-join-role.ts' },
        );
    }

    await member.roles.add(role);

}


const run: EventRun = async bot => {
    const gotData = await getData(bot, properties);
    if (gotData.error) {
        await botLog('error', gotData.error, bot.config._id, { location: 'user-join-role.ts' });
        return gotData.error;
    }
    data = gotData.data;
    botInstance = bot;
    bot.client.on('guildMemberAdd', userJoin);
    return;
};


const cancel: EventCancel = bot => {
    bot.client.off('guildMemberAdd', userJoin);
};


// noinspection JSUnusedGlobalSymbols
export const properties: BotEvent = {
    name: 'user-join-role',
    run,
    cancel,
    requiredDataKeys: [ { key: 'new-member-role-id', type: 'discord-role' } ],
};
