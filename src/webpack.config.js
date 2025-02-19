
module.exports = {
  devServer: {
    proxy: {
      '/api': 'https://slounik.andchar.of.by/',
    },
    hot: true,
  },

}
