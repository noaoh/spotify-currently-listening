const Filter = require('bad-words');

const parseCurrentlyListening = (data) => {
    const censor = new Filter();

    if (!data.is_playing) {
        return {
            isPlaying: false,
        };
    }

    const type = data.currently_playing_type;
    if (type === 'track') {
        const artists = data.item.artists.map((artist) => censor.clean(artist.name));
        const album = censor.clean(data.item.album.name);
        const track = censor.clean(data.item.name);
        return {
            isPlaying: true,
            artists,
            album,
            track,
            type,
        }
    } else if (type === 'episode') {
        const podcast = censor.clean(data.item.show.name);
        const episode = censor.clean(data.item.name);
        return {
            isPlaying: true,
            podcast,
            episode,
            type,
        }
    } else {
        throw new Error('Unknown currently playing type');
    }
};

module.exports = parseCurrentlyListening;
