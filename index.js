import RPC from "discord-rpc";
import jxa from "@jxa/run";
import axios from "axios";

const main = async () => {
  try {
    const client = new RPC.Client({ transport: "ipc" });
    const timer = setInterval(async () => {
      try {
        await setActivity(client);
      } catch (err) {
        console.error(err);
        clearInterval(timer);
        client.destroy();
        main();
      }
    }, 15e3);
  } catch (err) {
    console.error(err);
    setTimeout(main, 15e3);
  }
};

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

const setActivity = async (client) => {
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

        client.on("ready", async () => {
          client.setActivity(activity);
        });

        break;
      }

      default: {
        await client.clearActivity();
        break;
      }
    }
    client.login({ clientId: "947831155376422923" });
  } else {
    await client.clearActivity();
  }
};

main();
