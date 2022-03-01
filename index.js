import RPC from "discord-rpc";
import jxa from "@jxa/run";
import axios from "axios";

const client = new RPC.Client({ transport: "ipc" });

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
  timestamps: { end },
  assets: {
    large_image: artwork.data.thumb,
    large_text: properties.name,
  },
};

client.on("ready", async () => {
  await client.request("SET_ACTIVITY", {
    pid: process.pid,
    activity: activity,
  });
  console.log("done");
});

client.login({ clientId: "947831155376422923" });

// jxa
// .run(() => {
// const music = Application("Music");
// return {
// ...music.currentTrack().properties(),
// playerPosition: music.playerPosition(),
// };
// })
// .then((properties) => {
// fetchSongUrl().then((res) => {
// fetchArtwork(res).then((res) => {
// const delta = (properties.duration - properties.playerPosition) * 1000;
// const end = Math.ceil(Date.now() + delta);
// const activity = {
// details: properties.name,
// state: `${properties.artist} — ${properties.album}`,
// timestamps: { end: end },
// assets: {
// large_image: res.data.thumb,
// large_text: "Song",
// },
// instance: true,
// };

// client.on("ready", () => {
// client.request("SET_ACTIVITY", {
// pid: process.pid,
// activity: activity,
// });
// console.log("Done");
// });

// client.login({ clientId: "947831155376422923" });
// });
// });
// });
