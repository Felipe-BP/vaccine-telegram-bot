import { ServerResponse } from 'http';
import { APIGatewayProxyHandler } from 'aws-lambda';

import { setupBot } from '../src/setupBot';

const bot = setupBot();

export const setWebhook: APIGatewayProxyHandler = async () => {
    try {
        await bot.telegram.setWebhook('https://fd7d-168-90-56-165.ngrok.io/dev/bot');
    } catch (err) {
        return {
            statusCode: 500,
            body: err,
        };
    }

    return {
        statusCode: 200,
        body: 'Webhook successfully setup'
    };
};

export const handle: APIGatewayProxyHandler = async (event, _, cb) => {
    try {
        const rawUpdate = JSON.parse(event.body ?? '');

        const webhookResponse: Partial<ServerResponse> = {
            end: (data: any) => cb(null, {
                statusCode: 200,
                body: data,
                headers: { 'content-type': 'application/json' }
            }),
            headersSent: true,
        }

        await bot.handleUpdate(rawUpdate, webhookResponse as ServerResponse);
    } catch (err) {
        bot.stop('An unexpected error occured.');
        cb('An unexpected error occured.');
    }

    return {
        statusCode: 200,
        body: ''
    };
}
