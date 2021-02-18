// https://github.com/yagop/node-telegram-bot-api
const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
dotenv.config();

const token = process.env.API_TOKEN;

const bot = new TelegramBot(token, {
    polling: true
});

// Create USD currency formatter.
let formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

// Matches /start
bot.onText(/\/start/, function onStartText(msg) {
    const opts = {
        reply_to_message_id: msg.message_id,
        reply_markup: JSON.stringify({
            keyboard: [
                [{
                    text: 'Gime Price Bitcoin'
                }],
                [{
                    text: 'Gime Price Etherum'
                }]
            ]
        })
    };

    bot.sendMessage(msg.chat.id, 'Choose the Crypto Currency', opts);
});

// Matches Bitcoin
bot.onText(/Bitcoin/, function onBitcoinText(msg) {
    const chatId = msg.chat.id;
    sendCryptoPrice("btc-usd", chatId);
});
// Matches Etherum
bot.onText(/Etherum/, function onEtherumText(msg) {
    const chatId = msg.chat.id;
    sendCryptoPrice("eth-usd", chatId);
});


bot.on('polling_error', (err) => {
    console.log(err);
})

function sendCryptoPrice(currency, chatId) {
    
    const https = require('https');

    https.get(`https://api.cryptonator.com/api/ticker/${currency}`, (resp) => {
        let data;
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data = chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            var jsonData = JSON.parse(data);
            var amount = jsonData.ticker.price;

            bot.sendMessage(chatId, 'The price is: ' + formatter.format(amount));

        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });

}
