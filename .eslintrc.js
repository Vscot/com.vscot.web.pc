// const eslint = require('com.vscot.fabric/lib/eslint')


module.exports = {
  extends: [require.resolve('com.vscot.fabric/lib/tslint')],
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
    REACT_APP_ENV: true,
  },
};
