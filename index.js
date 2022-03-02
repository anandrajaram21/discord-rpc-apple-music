import RPC from "discord-rpc";
import jxa from "@jxa/run";
import axios from "axios";

const CLIENT_ID = "947831155376422923";
const client = new RPC.Client({ transport: "ipc" });

const isOpen = async () => {
  return jxa.run(() => {
    return Application("System Events").processes["Music"].exists();
  });
};

const getState = async () => {
  return jxa.run(() => {
    return Application("Music").playerState();
  });
};

const fetchArtwork = async (searchQuery) => {
  const params = {
    media: "music",
    term: searchQuery,
  };
  return axios.get("https://itunes.apple.com/search", {
    params,
  });
};

const setActivity = async () => {
  if (!client) return;
  const open = await isOpen();
  if (open) {
    const state = await getState();
    switch (state) {
      case "playing": {
        const properties = await jxa.run(() => {
          const music = Application("Music");
          return {
            ...music.currentTrack().properties(),
            playerPosition: music.playerPosition(),
          };
        });
        const artwork = await fetchArtwork(
          `${properties.name} ${properties.artist}`
        );
        const delta = (properties.duration - properties.playerPosition) * 1000;
        const end = Math.ceil(Date.now() + delta);

        const activity = {
          details: properties.name,
          state: `${properties.artist} — ${properties.album}`,
          endTimestamp: end,
          largeImageKey: artwork.data.results[0]
            ? artwork.data.results[0].artworkUrl100
            : "https://i.pinimg.com/originals/67/f6/cb/67f6cb14f862297e3c145014cdd6b635.jpg",
          largeImageText: properties.name,
          buttons: [
            artwork.data.results[0]
              ? {
                  label: "Listen on Apple Music",
                  url: artwork.data.results[0].trackViewUrl,
                }
              : {},
          ],
        };

        client.setActivity(activity);

        break;
      }

      default: {
        await client.clearActivity();
        break;
      }
    }
  } else {
    await client.clearActivity();
  }
};

client.on("ready", () => {
  console.log("Starting Apple Music RPC");
  setActivity();
  setInterval(() => {
    setActivity();
  }, 10e3);
});

client.login({ clientId: CLIENT_ID }).catch(console.error);
