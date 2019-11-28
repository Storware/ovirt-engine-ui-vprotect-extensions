import IntlMessageFormat from 'intl-messageformat'
import { defaultLocale } from '../constants'
import translatedMessages from '../intl/translations.json'

// TODO(vs) this is beyond simple utility functions, extract the code into services/intl

// IntlMessageFormat object cache
const messageFormats = new Map()

export function clearMessageCache () {
  messageFormats.clear()
}

let locale

export function initLocale (currentLocale) {
  locale = currentLocale
}

export function currentLocale () {
  return locale
}

/**
 * ECMA-402 Intl spec says that implementations need to, at the very least, support 2 time zones.
 * First is 'undefined' and equates to the "runtime's default time zone". Second is 'UTC'. Even
 * though the undefined value is ambiguous and we don't know what it is unless we parse a formatted
 * string, using a default of 'UTC' doesn't provide the desired user experience. Until there is
 * a better option, the browser default time zone will be used.
 */
let timeZone

export function initTimeZone (currentTimeZone) {
  timeZone = currentTimeZone
}

export function currentTimeZone () {
  return timeZone
}

export function translateMessage (id, defaultMessage) {
  const translation = translatedMessages[locale] && translatedMessages[locale][id]

  if (!translation) {
    if (__DEV__) console.warn(`Missing [${locale}] translation for message key [${id}]`)
    return defaultMessage
  }

  return translation
}

const customIntlMessageFormatStyles = {
  number: {
    '0': {
      style: 'decimal',
      minimumIntegerDigits: 1,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    },
    '0.0': {
      style: 'decimal',
      minimumIntegerDigits: 1,
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }
  }
}

export function formatMessage (id, defaultMessage, values = {}) {
  let fmt = messageFormats.get(id)

  if (!fmt) {
    // translation needed only for non-default locale
    const message = (locale !== defaultLocale) ? translateMessage(id, defaultMessage) : defaultMessage

    fmt = new IntlMessageFormat(message, locale, customIntlMessageFormatStyles)
    messageFormats.set(id, fmt)
  }

  return fmt.format(values)
}

export function formatPercent (num, digits = 0) {
  const fmt = new Intl.NumberFormat([ locale, defaultLocale ], {
    style: 'percent',
    minimumIntegerDigits: 1,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    useGrouping: false
  })
  return fmt.format(num)
}

export function formatPercent0D (num) {
  return formatPercent(num, 0)
}

export function formatPercent1D (num) {
  return formatPercent(num, 1)
}

export function formatNumber (num, digits = 0) {
  const fmt = new Intl.NumberFormat([ locale, defaultLocale ], {
    style: 'decimal',
    minimumIntegerDigits: 1,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    useGrouping: false
  })
  return fmt.format(num)
}

export function formatNumber0D (num) {
  return formatNumber(num, 0)
}

export function formatNumber1D (num) {
  return formatNumber(num, 1)
}

/**
 * Format a date object to a string with numeric month, day and year in the order
 * and style dictated by the module's current time zone.
 *
 * @returns {string} locale specific formatted month, day and year
 */
export function formatDate (date) {
  const fmt = new Intl.DateTimeFormat([ locale, defaultLocale ], {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    timeZone: timeZone
  })
  return fmt.format(date)
}

/**
 * Format a date object to a string with numeric month, day and year plus hour, minute,
 * second and time zone name in the order and style dictated by the module's current
 * time zone.
 *
 * @returns {string} locale specific formatted month, day, year, hour, minute, second
 * and time zone name
 */
export function formatDateTime (date) {
  const fmt = new Intl.DateTimeFormat([ locale, defaultLocale ], {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short',
    timeZone: timeZone
  })
  return fmt.format(date)
}
