const fetch = require('node-fetch');

const {
    SPOTIFY_CLIENT_ID: client_id,
    SPOTIFY_CLIENT_SECRET: client_secret,
    SPOTIFY_REFRESH_TOKEN: refresh_token,
} = process.env;

const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing?additional_types=track%2Cepisode';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

const getAccessToken = async () => {
    const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
    const reqBody = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token,
    });

    const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${basic}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: reqBody.toString()
    });

    if (response.status !== 200) {
        throw new Error('unable to retrieve access token for spotify')
    } else {
        return response.json();
    }
};

const getCurrentlyListening = async () => {
    const { access_token } = await getAccessToken();

    const resp = await fetch(NOW_PLAYING_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (resp.status !== 200) {
        return { 
            data: {
                is_playing: false,
            }
        };
    } else {
        return resp.json();
    }
};

module.exports = getCurrentlyListening;