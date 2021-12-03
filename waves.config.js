require('dotenv').config();

module.exports = {
  ride: {
    version: 3,
    settings: {
      needCompaction: false,
      removeUnusedCode: false,
    },
  },
  paths: {
    sources: './automates',
    artifacts: './automates-public/waves/build',
  }
};
