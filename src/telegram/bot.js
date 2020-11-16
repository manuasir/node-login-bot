const Telebot = require('telebot')
const Parser = require('../parser/parser')

class Bot {

  constructor(token) {
    this.bot = new Telebot(token)
    this.parser = new Parser()
  }

  async getContent(msg){
    try {
      const url = msg.text.split(' ')[1]
      const data = await this.parser.getContent(url)
      if (!data || !Array.isArray(data) || data.length === 0 || data[0].length === 0) {
        return msg.reply.text(`No logins found.`)
      }
      const rate = `Rate info: ${data[0][1]}, ${data[0][3]}, ${data[0][4]}`
      msg.reply.text(`Username: ${data[0][0]}\nPass: ${data[0][2]}\n${rate}`)
    } catch (error) {
      console.error('error ',error)
      msg.reply.text('Error.')
    }
  }

  async help(msg) {
    try {
      const msgStr =
        `Commands:\n` +
        `--------- \n` +
        `/login <domain> - Example: /login splunk.com`
      await msg.reply.text(msgStr)
    } catch (error) {
      await msg.reply.text('Error')
      console.error('Error.', error.message || error)
    }
  }

  start() {
    try {
      this.bot.on(['/start', '/hello'], (msg) => msg.reply.text('Hi!'))
      this.bot.on(['/help'], (msg) => this.help(msg))
      this.bot.on(['/login'], (msg) => this.getContent(msg))
      this.bot.start()
    } catch (error) {
      console.error('Unknown error.', error)
    }
  }
}

module.exports = Bot