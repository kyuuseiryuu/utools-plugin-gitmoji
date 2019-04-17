const electron = require('electron');
const gitmojiData = require('./data/gitmojiData.json');

window.helper = {
  electron,
  defaultData: gitmojiData
};
