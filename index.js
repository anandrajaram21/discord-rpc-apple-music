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

const fetchSongUrl = async () => {
  return "https://music.apple.com/in/album/legend/1440909016?i=1440909028";
};

const fetchArtwork = async (songUrl) => {
  const params = new URLSearchParams();
  params.append("url", songUrl);
  return axios.post(
    "https://clients.dodoapps.io/playlist-precis/playlist-artwork.php",
    params,
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );
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
        const songUrl = await fetchSongUrl();
        const artwork = await fetchArtwork(songUrl);
        const delta = (properties.duration - properties.playerPosition) * 1000;
        const end = Math.ceil(Date.now() + delta);

        const activity = {
          details: properties.name,
          state: `${properties.artist} — ${properties.album}`,
          endTimestamp: end,
          largeImageKey: artwork.data.thumb,
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

client.login({clientId: CLIENT_ID}).catch(console.error)
