#! /usr/bin/node
const stringify = require('json-stable-stringify')
const fs = require('fs')
const chalk = require('chalk')

const filename = [
  'src/intl/translations.json',
  '../src/intl/translations.json'
].find(filename => fs.existsSync(filename))

const translatedMessages = JSON.parse(fs.readFileSync(filename, 'utf8'))

console.log(chalk`removing empty translations from {green ${filename}}`)
Object.keys(translatedMessages).forEach(locale => {
  const removed = []
  Object.keys(translatedMessages[locale]).forEach(id => {
    if (translatedMessages[locale][id] === '') {
      removed.push(id)
      delete translatedMessages[locale][id]
    }
  })
  if (removed.length) {
    console.log(chalk`\t{yellow ${locale}}`)
    removed.forEach(key => { console.log(chalk`\t\t{yellow ${key}}`) })
  }
})

console.log(chalk`normalizing translations in {green ${filename}}`)
const pretty = stringify(translatedMessages, {
  space: '  ',
  cmp: (a, b) => { return a.key > b.key ? 1 : -1 }
})

fs.writeFileSync(filename, pretty, 'utf8')
