const path = require('path');

module.exports = {
  devServer: {
    proxy: {
      '/api': 'http://slounik.andchar.of.by/',
      '/api': 'https://slounik.andchar.of.by/',
    },
    hot: true,
  },

}
