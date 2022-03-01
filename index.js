const RPC = require("discord-rpc");
const jxa = require("@jxa/run");

const client = new RPC.Client({ transport: "ipc" });

const fetchArtwork = (songId) => {};

const setActivity = (songProperties) => {};

jxa
  .run(() => {
    return Application("Music").currentTrack().properties();
  })
  .then((trackName) => {
    const activity = {
      details: trackName.name,
      assets: {
        large_image:
          "https://i.pinimg.com/originals/67/f6/cb/67f6cb14f862297e3c145014cdd6b635.jpg",
        large_text: "Song",
      },
      timestamps: { start: Date.now() },
      instance: true,
    };

    client.on("ready", () => {
      client.request("SET_ACTIVITY", { pid: process.pid, activity: activity });
      console.log("Done");
    });

    client.login({ clientId: "947831155376422923" });
  });
