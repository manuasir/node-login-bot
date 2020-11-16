const got = require('got')
const cheerio = require('cheerio')

class Parser {

  constructor() {
    this.url = `http://bugmenot.com/view/`
  }

  async getContent(url, selector) {
    try {
      const finalUrl = this.url + url
      const html = await got(finalUrl)
      const $ = cheerio.load(html.body)
      const results = []
      const credList = $('kbd').toArray()
      let tmpArr = []
      // Getting rate
      const rateArray = $('li').toArray()
      credList.forEach( (item,index) => {
        const element = $(item).html()
        tmpArr.push(element)
        tmpArr.push($(rateArray[index]).html())

        // make a group
        if ( (index + 1) % 2 === 0 || index === credList.length - 1) {
          tmpArr.push($(rateArray[index + 1]).html())
          results.push(tmpArr)
          tmpArr = []
        }
      })
      return results
    } catch (error) {
      return Promise.reject(error.message || error)
    }
  }

}

module.exports = Parser