const path = require('path');

module.exports = {
  extends: [require.resolve('com.vscot.fabric/lib/tslint')],
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
    REACT_APP_ENV: true,
  },
  parserOptions: {
    project: path.join(__dirname, './tsconfig.json'),
  },
};
