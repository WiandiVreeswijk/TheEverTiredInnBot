const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../data/movies.json');

function ensureFileExists() {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(
            filePath,
            JSON.stringify({ suggestions: [], votingOpen: true }, null, 2)
        );
    }
}

function loadMovieData() {
    ensureFileExists();
    const raw = fs.readFileSync(filePath, 'utf8');

    const cleaned = raw.replace(/^\uFEFF/, '');
    return JSON.parse(cleaned);
}

function saveMovieData(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = {
    loadMovieData,
    saveMovieData
};