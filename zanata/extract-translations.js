#! /usr/bin/node
const stringify = require('json-stable-stringify')
const fs = require('fs-extra')
const chalk = require('chalk')

const defaultMessages = require('../src/intl/messages.js')
const messages = []

const targetRoot = ['src', '../src'].find((filename, index) => fs.existsSync(filename)).replace('src', 'extra')
const targetPath = `${targetRoot}/messages/src`
const target = `${targetPath}/messages.json`

console.log(chalk`cleaning target path {red ${targetRoot}}`)
if (fs.existsSync(targetRoot)) {
  fs.removeSync(targetRoot)
}

console.log(chalk`converting keyed messages from {green src/intl/messages.js} to JSON array`)
Object.keys(defaultMessages)
  .sort((a, b) => defaultMessages[a].id > defaultMessages[b].id ? 1 : -1)
  .forEach(key => {
    messages.push(defaultMessages[key])
  })

console.log(chalk`create target output path {green ${targetPath}}`)
fs.ensureDirSync(targetPath)

console.log(chalk`writing ${messages.length} messages to {green ${target}}`)
const pretty = stringify(messages, { space: '  ' })
fs.writeFileSync(target, pretty, 'utf8')
