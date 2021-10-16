import { Context } from 'telegraf';
import { Browser } from 'puppeteer-core';
import chrome from 'chrome-aws-lambda';

const {
    SOURCE_URL,
    FIRST_INPUT_VALUE,
    SECONDS_INPUT_VALUE
} = process.env;

export const checkCommandHandler = async (ctx: Context) => {
    let browser: Browser | null = null;
    try {
        browser = await chrome.puppeteer.launch({
            args: chrome.args,
            defaultViewport: chrome.defaultViewport,
            executablePath: await chrome.executablePath,
            headless: true,
            ignoreHTTPSErrors: true,
        });

        let page = await browser?.newPage();

        await page.goto(SOURCE_URL as string, {
            waitUntil: "networkidle0"
        });

        await page.click('[data-componentid="O80_id"]');
        
        await page.waitForSelector('.x-form-field', { visible: true });
        const [firstInput, secondInput] = await page.$$('.x-form-field');
        
        await firstInput.type(FIRST_INPUT_VALUE as string);
        await secondInput.type(SECONDS_INPUT_VALUE as string);
        
        await page.click('[data-componentid="O183_id"]');
        
        await page.waitForNetworkIdle();

        const buffer = await page.screenshot();

        ctx.replyWithPhoto({ source: buffer as Buffer });
    } catch (error) {
        ctx.reply(`An unexpected error occured! ${error}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};
