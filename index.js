const RPC = require("discord-rpc");
const jxa = require("@jxa/run");
const axios = require("axios");

const client = new RPC.Client({ transport: "ipc" });

const fetchSongUrl = async () => {
  return "https://music.apple.com/in/album/ripples-in-the-sand/1583651332?i=1583651917";
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

jxa
  .run(() => {
    return Application("Music").currentTrack().properties();
  })
  .then((properties) => {
    fetchSongUrl().then((res) => {
      fetchArtwork(res).then((res) => {
        const activity = {
          details: properties.name,
          assets: {
            large_image: res.data.thumb,
            large_text: "Song",
          },
          timestamps: { start: Date.now() },
          instance: true,
        };

        client.on("ready", () => {
          client.request("SET_ACTIVITY", {
            pid: process.pid,
            activity: activity,
          });
          console.log("Done");
        });

        client.login({ clientId: "947831155376422923" });
      });
    });
  });
