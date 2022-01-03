const TelegramBot = require('node-telegram-bot-api')

const token = '5090473246:AAEBeI7d5STUZAiCOKft74XCXMaiuw3se6M'
const chatId = '-784431716'

const bot = new TelegramBot(token, { polling: false })

const send = (message = '') => {
  bot.sendMessage(chatId, message, { parse_mode: 'HTML' })
}

module.exports = {
  send
}
