module.exports = {
    devServer: {
      proxy: {
        '/api': 'http://slounik.andchar.of.by/',
      },
      hot: true,
    },
  };
  