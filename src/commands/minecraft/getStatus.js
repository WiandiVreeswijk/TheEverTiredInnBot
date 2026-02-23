const logger = require('../../utils/logger');

const SERVER_ADDRESS = '152.228.198.219:19132';
const API_URL = `https://api.mcsrvstat.us/bedrock/2/${SERVER_ADDRESS}`;

async function getMinecraftStatus() {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        const res = await fetch(API_URL, {
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!res.ok) {
            throw new Error(`API returned status ${res.status}`);
        }

        const data = await res.json();

        if (typeof data !== 'object') {
            throw new Error('Invalid API response');
        }

        return data;

    } catch (error) {
        logger.error(`Minecraft status fetch failed: ${error.message}`);
        throw error;
    }
}

module.exports = { getMinecraftStatus };