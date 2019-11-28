const fs = require('fs')
const chalk = require('chalk')
const table = require('table').table

function round (number, precision = 0) {
  const factor = Math.pow(10, precision)
  const temp = number * factor
  const roundedTemp = Math.round(temp)
  return roundedTemp / factor
}

function reportDuplicateValues (englishMessages, translatedMessagesPerLocale) {
  const byValue = {}
  Object.keys(englishMessages).forEach(key => {
    const value = typeof englishMessages[key] === 'string' ? englishMessages[key] : englishMessages[key].message
    const byVal = byValue[value] || []
    byVal.push(key)
    byValue[value] = byVal
  })

  const report = []
  Object.keys(byValue)
    .filter(value => byValue[value].length > 1)
    .forEach(value => {
      report.push([
        chalk`{blue ${value}}`,
        byValue[value].join('\n'),
        byValue[value]
          .map(key => {
            const localesWithKey = []
            Object.keys(translatedMessagesPerLocale).forEach(locale => {
              if (translatedMessagesPerLocale[locale][key]) {
                localesWithKey.push(chalk.magenta(locale))
              }
            })
            return chalk`{yellow ${localesWithKey.length}}: ${localesWithKey.join(', ')}`
          })
          .join('\n'),
        byValue[value]
          .map(key => {
            const localesWithKey = []
            Object.keys(translatedMessagesPerLocale).forEach(locale => {
              if (!translatedMessagesPerLocale[locale][key]) {
                localesWithKey.push(chalk.magenta(locale))
              }
            })
            return chalk`{yellow ${localesWithKey.length}}: ${localesWithKey.join(', ')}`
          })
          .join('\n')
      ])
    })

  return chalk`Multiple value count: {yellow ${report.length}}\n` +
    (report.length === 0
      ? 'No keys with duplicate values!'
      : table([ ['Text', 'Key', 'Locales With Key', 'Locales w/o Key'], ...report ])
    )
}

function reportUntranslatedKeys (englishMessages, translatedMessagesPerLocale) {
  const messagesKeyCount = Object.keys(englishMessages).length

  const untranslated = {}
  Object.entries(translatedMessagesPerLocale).forEach(([locale, translated]) => {
    untranslated[locale] = []
    Object.keys(englishMessages)
      .filter(key => !translated[key])
      .forEach(key => { untranslated[locale].push(key) })
  })

  const untranslatedReport = []
  Object.keys(untranslated)
    .filter(locale => untranslated[locale].length > 0)
    .forEach(locale => {
      const untranslatedPercent = round(untranslated[locale].length / messagesKeyCount * 100, 1)
      untranslatedReport.push([
        chalk.blue(locale),
        chalk.magenta(`${untranslatedPercent}%`),
        untranslatedPercent > 20.0
          ? chalk.red(`>20% of keys are untranslated [${untranslated[locale].length}/${messagesKeyCount}]`)
          : untranslated[locale].sort().join('\n')
      ])
    })

  return (untranslatedReport.length === 0)
    ? chalk`{green All keys for all locales are translated!}`
    : table([ ['locale', '% untranslated', 'keys'], ...untranslatedReport ])
}

function reportCoverage (englishMessages, translatedMessagesPerLocale) {
  const messagesKeyCount = Object.keys(englishMessages).length

  const report = []
  Object.entries(translatedMessagesPerLocale).forEach(
    ([locale, translated]) => {
      const localKeyCount = Object.keys(translated).length
      const percent = round((localKeyCount / messagesKeyCount) * 100, 1)
      report.push([
        chalk.blue(locale),
        `${localKeyCount}/${messagesKeyCount}`,
        chalk.yellow(`${percent}%`)
      ])
    }
  )

  return table([['locale', 'keys', 'percent'], ...report], {
    columns: {
      '0': {},
      '1': { alignment: 'right' },
      '2': { alignment: 'right' }
    },
    drawHorizontalLine: (index, size) => index === 0 || index === 1 || index === size
  })
}

//
// Run the reports...
//
const filename = [
  'src/intl/translations.json',
  '../src/intl/translations.json'
].find(filename => fs.existsSync(filename))

const translatedMessagesPerLocale = JSON.parse(fs.readFileSync(filename, 'utf8'))

const englishMessages1 = require('../src/intl/messages')
const englishMessages = {}
Object.entries(englishMessages1).forEach(([ key, { id, defaultMessage } ]) => {
  englishMessages[id] = defaultMessage
})

console.log(chalk`English key count: {yellow ${Object.keys(englishMessages).length}}


Untranslated keys per locale:
${reportUntranslatedKeys(englishMessages, translatedMessagesPerLocale)}


${reportDuplicateValues(englishMessages, translatedMessagesPerLocale)}


Translation coverage report:
${reportCoverage(englishMessages, translatedMessagesPerLocale)}
`)
