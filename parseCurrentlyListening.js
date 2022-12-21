const parseCurrentlyListening = (data) => {
    if (!data.is_playing) {
        return {
            isPlaying: false,
        };
    }

    const type = data.currently_playing_type;
    if (type === 'track') {
        const artists = data.item.artists.map((artist) => artist.name);
        const album = data.item.album.name;
        const track = data.item.name;
        return {
            isPlaying: true,
            artists,
            album,
            track,
        }
    } else if (type === 'episode') {
        const podcast = data.item.show.name;
        const episode = data.item.name;
        return {
            isPlaying: true,
            podcast,
            episode,
        }
    } else {
        throw new Error('Unknown currently playing type');
    }
};

module.exports = parseCurrentlyListening;
