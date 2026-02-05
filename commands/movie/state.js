const suggestions = [];
let votingOpen = true;

module.exports = {
    suggestions,
    get votingOpen() {
        return votingOpen;
    },
    set votingOpen(value) {
        votingOpen = value;
    }
};