import RPC from "discord-rpc";
import jxa from "@jxa/run";
import fs from 'fs';
import os from 'os';
import osascript from "node-osascript";
import albumArt from "album-art";
const config = JSON.parse(fs.readFileSync('./config/config.json', 'utf-8'))

const fetchAlbumArt = config.fetchAlbumArtOnline;

const CLIENT_ID = "1043683037105360947";
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
        console.log(properties.albumArt);
        const nameandartist = encodeURI(`${properties.artist} ${properties.name}`)
        const options = {
          album: encodeURI(`${properties.album}`)
        }
        if (fetchAlbumArt === 'true' ){
           var artwork = await albumArt(`${properties.arist}`, options).then((data) => data);
        } else if (fetchAlbumArt === 'false') {
          osascript.executeFile('./getartwork.applescript',function(err,result,raw){
            if(err) return console.error(err)
            });
          var artwork = `${os.homedir()}/Documents/MusicRpcPhotos/cover.jpg`
        }
        
        var artwork = String(artwork);
        console.log(artwork);
        
          
        const delta = (properties.duration - properties.playerPosition) * 1000;
        const end = Math.ceil(Date.now() + delta);
        console.log(`${properties.artist} - ${properties.album}`)
        const activity = {
          details: properties.name,
          state: `${properties.artist} — ${properties.album}`,
          endTimestamp: end,
          largeImageKey: artwork
            ? artwork
            : "https://i.pinimg.com/originals/67/f6/cb/67f6cb14f862297e3c145014cdd6b635.jpg",
          largeImageText: properties.name,
          buttons: [
            artwork
              ? {
                  label: "Listen on Youtube",
                  url: String(`https://www.youtube.com/results?search_query=${nameandartist}`),
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
