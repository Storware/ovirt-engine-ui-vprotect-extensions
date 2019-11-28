// NOTE: These polyfills are most likely unnecessary for our supported browsers. If verified,
//       they may be removed and save the space in the bundle.

// fetch() polyfill for making API calls.
require('whatwg-fetch')

// Core-js polyfills for using Array.prototype.includes, Object.assign and Promise
require('core-js/stable')
