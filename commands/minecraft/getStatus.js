async function getMinecraftStatus() {
    const res = await fetch(
        'https://api.mcsrvstat.us/bedrock/2/152.228.198.219:19132'
    );
    return res.json();
}

module.exports = { getMinecraftStatus };
