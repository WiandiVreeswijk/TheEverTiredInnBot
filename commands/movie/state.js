const { loadMovieData } = require('./storage');

const data = loadMovieData();

module.exports = data;