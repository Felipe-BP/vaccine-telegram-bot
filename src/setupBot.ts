import { Telegraf } from 'telegraf';

import { checkCommandHandler } from './commands';

const { TELEGRAM_TOKEN: token } = process.env;

export const setupBot = () => {
    if (!token) {
        throw new Error('TELEGRAM_TOKEN must be provided!');
    }

    const bot = new Telegraf(token, {
        telegram: {
            webhookReply: true
        }
    });
    
    bot.start((ctx) => {
        ctx.reply('Hello from Vaccine Bot! Use /help to view available commands');
    });
    
    bot.help((ctx) => {
        ctx.reply(`
            Command Reference:
            /start - Start conversation with Bot
            /check - Check if the Covid-19 vaccine is available
            /whoami - Show information about the current user
            /help - Show help page
        `);
    });
    
    bot.command('whoami', (ctx) => {
        ctx.reply(JSON.stringify(ctx.from));
    });
    
    bot.command('check', checkCommandHandler);
    
    bot.on('text', (ctx) => ctx.reply('I can\'t understand what you want, make sure you typed a available command! Use /help to view commands.'));

    return bot;
};
