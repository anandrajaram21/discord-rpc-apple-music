import RPC from "discord-rpc";
import jxa from "@jxa/run";
import yt from 'ytsr';
import fs from 'fs';
import axios from "axios";
import os from 'os';
import osascript from "node-osascript";
import albumArt from "album-art";
import { encode } from "punycode";
import { stringify } from "querystring";
const config = JSON.parse(fs.readFileSync('./config/config.json', 'utf-8'))

const fetchAlbumArt = config.fetchAlbumArtOnline;
const whereToFetchOnline = config.whereToFetchOnline;
const enableArtworkSaving = config.enableArtworkSaving;
const enableYoutubeButton = config.changeButtonProvider;

const CLIENT_ID = "1043683037105360947";
const client = new RPC.Client({ transport: "ipc" });

const fetchArtworkApple = async (searchQuery) => {
  const params = {
    media: "music",
    term: searchQuery,
  };
  return axios.get("https://itunes.apple.com/search", {
    params,
  });
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
        const nameandartist = encodeURIComponent(`${properties.artist} ${properties.name}`);
        const options = {
          album: encodeURIComponent(`${properties.album.replace("(", "%20").replace(")", "%20")}`)
        };
        const search = await yt(`${properties.name} ${properties.artist}`, { limit: 1 })
        const config = JSON.stringify(search.items)
        const result = JSON.parse(config)
        
        
        if (fetchAlbumArt === 'true' ){
          if (whereToFetchOnline === 'spotify'){
            var artwork = await albumArt(`${encodeURIComponent(properties.arist)}`, options).then((data) => data);
          } else {
            var appleresponse = await fetchArtworkApple(
              `${properties.name} ${properties.artist}`
            );
            var artwork = appleresponse.data.results[0].artworkUrl100;
          };
        } else if (fetchAlbumArt === 'false') {
          osascript.executeFile('./applescript/getartwork.applescript',function(err,result,raw){
            if(err) return console.error(err)
            });
          var artwork = `${os.homedir()}/Documents/MusicRpcPhotos/cover.jpg`;
        };
        
       

          
        const delta = (properties.duration - properties.playerPosition) * 1000;
        const end = Math.ceil(Date.now() + delta);
        console.log(`${properties.artist} - ${properties.album}`)
        if (enableArtworkSaving === 'true'){
          osascript.executeFile('./applescript/saveartwork.applescript',{artistname:`${encodeURIComponent(properties.artist.replace("(", "%20").replace(")", "%20"))}`, songname:`${encodeURIComponent(properties.name.replace("(", "%20").replace(")", "%20"))}`},function(err,result,raw){
            if(err) return console.error(err)
            });
        }
        const activity = {
          details: properties.name,
          state: `${properties.artist} — ${properties.album}`,
          endTimestamp: end,
          largeImageKey: artwork
            ? artwork
            : "https://i.pinimg.com/originals/67/f6/cb/67f6cb14f862297e3c145014cdd6b635.jpg",
          largeImageText: properties.name,
          buttons: [
            enableYoutubeButton
              ?  {
                  label: "Listen on Youtube",
                  url: result[0].url,
                }
              : {
                label: "Listen on Apple Music",
                url: appleresponse.data.results[0].trackViewUrl,
            },
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
