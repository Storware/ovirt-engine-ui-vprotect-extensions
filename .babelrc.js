require('core-js/stable');
require('regenerator-runtime/runtime');

const targetBrowsers = [
  // include browsers with at least 0.5% global coverage
  '> 0.5%',
  // exclude browsers without official support or updates for 24 months
  'not dead',
  // exclude IE - we are committed to support Edge
  'not ie > 0',
  // include Firefox ESR (Extended Support Release)
  'firefox esr',
  // include last 2 versions of browsers we are committed to support
  'last 2 Chrome versions',
  'last 2 Firefox versions',
  'last 2 Edge versions',
  'last 2 Safari versions',
];

const env = process.env.NODE_ENV || 'development';

// babel configs
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: targetBrowsers,
          node: 'current',
        },
        debug: !process.env.Q && env === 'development',
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [['@babel/plugin-proposal-class-properties']],
};
