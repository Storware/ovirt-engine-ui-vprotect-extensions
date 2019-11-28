import { expect } from 'chai'
import { initLocale, currentLocale, initTimeZone, currentTimeZone, formatNumber, formatPercent, formatDate, formatDateTime, formatMessage } from './intl'

function checkLocale (locale, localeJanuaryName) {
  try {
    const january = new Date(9e8)
    const inLocale = new Intl.DateTimeFormat(locale, { month: 'long' })
    return inLocale.format(january) === localeJanuaryName
  } catch (err) {
    return false
  }
}

const isAvailable = {
  'it-IT': checkLocale('it-IT', 'gennaio'),
  'de-DE': checkLocale('de-DE', 'Januar'),
  'fr-FR': checkLocale('fr-FR', 'janvier')
}
console.info(`Based on locale data detection, specific locales to be tested: [${Object.keys(isAvailable).filter(key => isAvailable[key]).join(', ')}]`)

describe('Intl Number Formatters', function () {
  describe('format numbers (en-US)', function () {
    it('format number >999 w/o grouping', function () {
      expect(formatNumber(12345, 0)).to.equal('12345')
    })

    it('format number to integers with rounding', function () {
      expect(formatNumber(987, 0)).to.equal('987')
      expect(formatNumber(987.4, 0)).to.equal('987')
      expect(formatNumber(987.5, 0)).to.equal('988')
    })

    it('format number to tenths with rounding', function () {
      expect(formatNumber(987, 1)).to.equal('987.0')
      expect(formatNumber(987.6, 1)).to.equal('987.6')
      expect(formatNumber(987.64, 1)).to.equal('987.6')
      expect(formatNumber(987.65, 1)).to.equal('987.7')
    })

    it('format number to hundredths with rounding', function () {
      expect(formatNumber(987, 2)).to.equal('987.00')
      expect(formatNumber(987.6, 2)).to.equal('987.60')
      expect(formatNumber(987.65, 2)).to.equal('987.65')
      expect(formatNumber(987.654, 2)).to.equal('987.65')
      expect(formatNumber(987.655, 2)).to.equal('987.66')
    })
  })

  if (isAvailable['it-IT']) {
    describe('format numbers (it-IT)', function () {
      it('format number with localized decimal point', function () {
        initLocale('it-IT')
        expect(currentLocale()).to.equal('it-IT')

        expect(formatNumber(987.654, 3)).to.equal('987,654')
      })
    })
  }
})

describe('Intl Percent Formatters', function () {
  describe('format percent (en-US)', function () {
    it('format percent w/o grouping', function () {
      expect(formatPercent(1, 0)).to.equal('100%')
      expect(formatPercent(100, 0)).to.equal('10000%')
    })

    it('format percents to integers with rounding', function () {
      expect(formatPercent(0.012, 0)).to.equal('1%')
      expect(formatPercent(0.015, 0)).to.equal('2%')
    })

    it('format number to tenths/hundredths with rounding', function () {
      expect(formatPercent(1, 1)).to.equal('100.0%')
      expect(formatPercent(0.012, 1)).to.equal('1.2%')
      expect(formatPercent(0.0124, 1)).to.equal('1.2%')
      expect(formatPercent(0.01245, 1)).to.equal('1.2%')
      expect(formatPercent(0.0125, 1)).to.equal('1.3%')

      expect(formatPercent(1, 2)).to.equal('100.00%')
      expect(formatPercent(0.012, 2)).to.equal('1.20%')
      expect(formatPercent(0.01234, 2)).to.equal('1.23%')
      expect(formatPercent(0.01235, 2)).to.equal('1.24%') // TODO(sd): should this round up or truncate???
      expect(formatPercent(0.01236, 2)).to.equal('1.24%')
    })
  })

  if (isAvailable['it-IT']) {
    describe('format percents (it-IT)', function () {
      it('format percents with localized decimal point and % placement', function () {
        initLocale('it-IT')
        expect(currentLocale()).to.equal('it-IT')

        expect(formatPercent(1, 0)).to.equal('100%')
        expect(formatPercent(1, 1)).to.equal('100,0%')
        expect(formatPercent(1, 2)).to.equal('100,00%')
        expect(formatPercent(1, 3)).to.equal('100,000%')

        expect(formatPercent(0.0987, 0)).to.equal('10%')
        expect(formatPercent(0.0987, 1)).to.equal('9,9%')
        expect(formatPercent(0.0987, 2)).to.equal('9,87%')
        expect(formatPercent(0.0987, 3)).to.equal('9,870%')
      })
    })
  }

  if (isAvailable['de-DE']) {
    describe('format percents (de-DE)', function () {
      it('format percents with localized decimal point and "&nbsp;%" (de-DE)', function () {
        initLocale('de-DE')
        expect(currentLocale()).to.equal('de-DE')

        expect(formatPercent(0.0987, 0)).to.equal('10\xA0%') // \xA0 === &nbsp;
        expect(formatPercent(0.0987, 1)).to.equal('9,9\xA0%')
        expect(formatPercent(0.0987, 2)).to.equal('9,87\xA0%')
        expect(formatPercent(0.0987, 3)).to.equal('9,870\xA0%')
      })
    })
  }
})

// Extract the UTC time zone's locale specific name from a formatted DateTime.
function extractUtcTimezoneName (locale) {
  return extractTimeZoneName(locale, 'UTC')
}

/*
 * Extract the time zone's locale specific name from a formatted DateTime.  Use that
 * locale specific name in test comparison.
 *
 * NOTE: The Intl polyfill, required by PhantomJS, does not currently output any
 * timezone name.  Expected output from this function is '' in an Intl polyfill
 * environment.
 */
function extractTimeZoneName (locale, timeZone) {
  // This is the minimal time + timezone only formatter configuration that must be supported by a ECMA-402 implementation
  const dtf = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    timeZoneName: 'short',
    timeZone: timeZone
  })
  let tzName = dtf.format()
  tzName = tzName.substr(tzName.indexOf(' ')).trim()
  return tzName
}

// TODO(sd): If Intl polyfill ever adds a timezone name (specifically UTC) to it's formatted output,
// or jsdom/node adds Intl support, a new test can be added to verifiy that initTimeZone() works.
// The test would just verify that if the undefined and 'UTC' time zone names are not the same,
// then the formatted output is different.

describe('DateTime Formatters', function () {
  describe('format dates and date+times (en-US)', function () {
    it('format date', function () {
      initTimeZone('UTC')
      expect(currentTimeZone()).to.equal('UTC')

      expect(formatDate(new Date(Date.UTC(1999, 11, 31)))).to.equal('12/31/1999')
      expect(formatDate(new Date(Date.UTC(2020, 6, 4)))).to.equal('7/4/2020')
    })
    it('format datetime', function () {
      initTimeZone('UTC')
      const amName = 'AM'
      const pmName = 'PM'
      const utcTzName = extractUtcTimezoneName(currentLocale())

      expect(formatDateTime(new Date(Date.UTC(1999, 11, 31, 16, 35, 42)))).to.equal(`12/31/1999, 4:35:42 ${pmName} ${utcTzName}`)
      expect(formatDateTime(new Date(Date.UTC(2020, 6, 4, 11, 12, 13)))).to.equal(`7/4/2020, 11:12:13 ${amName} ${utcTzName}`)
    })
  })

  if (isAvailable['it-IT']) {
    describe('format date (it-IT)', function () {
      it('format date', function () {
        initLocale('it-IT')
        expect(currentLocale()).to.equal('it-IT')

        initTimeZone('UTC')
        expect(currentTimeZone()).to.equal('UTC')

        expect(formatDate(new Date(Date.UTC(1999, 11, 31)))).to.equal('31/12/1999')
        expect(formatDate(new Date(Date.UTC(2020, 6, 4)))).to.equal('4/7/2020')
      })
      it('format datetime', function () {
        initLocale('it-IT')
        initTimeZone('UTC')
        const utcTzName = extractUtcTimezoneName(currentLocale())

        expect(formatDateTime(new Date(Date.UTC(1999, 11, 31, 16, 35, 42)))).to.equal(`31/12/1999, 16:35:42 ${utcTzName}`)
        expect(formatDateTime(new Date(Date.UTC(2020, 6, 4, 11, 12, 13)))).to.equal(`4/7/2020, 11:12:13 ${utcTzName}`)
      })
    })
  }

  if (isAvailable['de-DE']) {
    describe('format date (de-DE)', function () {
      it('format date', function () {
        initLocale('de-DE')
        expect(currentLocale()).to.equal('de-DE')

        initTimeZone('UTC')
        expect(currentTimeZone()).to.equal('UTC')

        expect(formatDate(new Date(Date.UTC(1999, 11, 31)))).to.equal('31.12.1999')
        expect(formatDate(new Date(Date.UTC(2020, 6, 4)))).to.equal('4.7.2020')
      })
      it('format datetime', function () {
        initLocale('de-DE')
        initTimeZone('UTC')
        const utcTzName = extractUtcTimezoneName(currentLocale())

        expect(formatDateTime(new Date(Date.UTC(1999, 11, 31, 16, 35, 42)))).to.equal(`31.12.1999, 16:35:42 ${utcTzName}`)
        expect(formatDateTime(new Date(Date.UTC(2020, 6, 4, 11, 12, 13)))).to.equal(`4.7.2020, 11:12:13 ${utcTzName}`)
      })
    })
  }
})

describe('MessageFormat custom number styles', function () {
  describe('numbers in messages', function () {
    it('unstyled include', function () {
      expect(formatMessage('test1', '{n}', { n: 1234.5678 })).to.equal('1234.5678')
    })

    it('as number with default format options', function () {
      expect(formatMessage('test1', '{n, number}', { n: 1234.5 })).to.equal('1,234.5')
      expect(formatMessage('test2', '{n, number}', { n: 1234.56 })).to.equal('1,234.56')
      expect(formatMessage('test3', '{n, number}', { n: 1234.567 })).to.equal('1,234.567')
      expect(formatMessage('test4', '{n, number}', { n: 1234.5674 })).to.equal('1,234.567')
      expect(formatMessage('test5', '{n, number}', { n: 1234.5675 })).to.equal('1,234.568')
    })

    it('custom number style "0" - rounded to integer', function () {
      expect(formatMessage('test1', '{n, number, 0}', { n: 1234.4 })).to.equal('1,234')
      expect(formatMessage('test2', '{n, number, 0}', { n: 1234.5 })).to.equal('1,235')
    })

    it('custom number style "0.0" - rounded to 1 decimal place', function () {
      expect(formatMessage('test1', '{n, number, 0.0}', { n: 1234.5 })).to.equal('1,234.5')
      expect(formatMessage('test2', '{n, number, 0.0}', { n: 1234.54 })).to.equal('1,234.5')
      expect(formatMessage('test3', '{n, number, 0.0}', { n: 1234.55 })).to.equal('1,234.6')
    })
  })

  const localeTests = [
    { locale: 'de-DE', groupSeparator: '.', decimalSeparator: ',' },
    { locale: 'fr-FR', groupSeparator: '\u202F' /* narrow no-break space */, decimalSeparator: ',' }
  ]

  localeTests.forEach(test => {
    let { locale: l, groupSeparator: g, decimalSeparator: d } = test
    if (!isAvailable[l]) {
      return
    }

    describe(`numbers in messages (${l})`, function () {
      it('unstyled include', function () {
        initLocale(l)
        expect(currentLocale()).to.equal(l)

        expect(formatMessage('test1', '{n}', { n: 1234.5678 })).to.equal('1234.5678')
      })

      it('as number with default format options', function () {
        initLocale(l)
        expect(currentLocale()).to.equal(l)

        expect(formatMessage('test1', '{n, number}', { n: 1234.5 })).to.equal(`1${g}234${d}5`)
        expect(formatMessage('test2', '{n, number}', { n: 1234.56 })).to.equal(`1${g}234${d}56`)
        expect(formatMessage('test3', '{n, number}', { n: 1234.567 })).to.equal(`1${g}234${d}567`)
        expect(formatMessage('test4', '{n, number}', { n: 1234.5674 })).to.equal(`1${g}234${d}567`)
        expect(formatMessage('test5', '{n, number}', { n: 1234.5675 })).to.equal(`1${g}234${d}568`)
      })

      it('custom number style "0" - rounded to integer', function () {
        initLocale(l)
        expect(currentLocale()).to.equal(l)

        expect(formatMessage('test1', '{n, number, 0}', { n: 1234.4 })).to.equal(`1${g}234`)
        expect(formatMessage('test2', '{n, number, 0}', { n: 1234.5 })).to.equal(`1${g}235`)
      })

      it('custom number style "0.0" - rounded to 1 decimal place', function () {
        initLocale(l)
        expect(currentLocale()).to.equal(l)

        expect(formatMessage('test1', '{n, number, 0.0}', { n: 1234.5 })).to.equal(`1${g}234${d}5`)
        expect(formatMessage('test2', '{n, number, 0.0}', { n: 1234.54 })).to.equal(`1${g}234${d}5`)
        expect(formatMessage('test3', '{n, number, 0.0}', { n: 1234.55 })).to.equal(`1${g}234${d}6`)
      })
    })
  })
})
