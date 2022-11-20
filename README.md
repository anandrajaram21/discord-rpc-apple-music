# Apple Music Discord RPC

Discord RPC Client for Apple Music (macOS Big Sur and above). If you are using macOS, you'd be forced to use the default Apple Music app if you want to enjoy lossless audio. If you are using Windows/Linux, just use [Cider](https://cider.sh), they have an inbuilt Discord RPC implementation which uses Apple MusicKit to fetch information about the tracks (which is much more reliable than the method employed here to fetch data). Unfortunately, Cider doesn't support lossless audio (yet), so this is a handy alternative to get the Discord RPC working till then.

## Disclaimer

A lot of the techniques used here have taken inspiration heavily from [this repo](https://github.com/NextFire/apple-music-discord-rpc). A lot of what I did wouldn't have been possible without the ideas from their particular implementation.

## Why

In the repo mentioned before, I faced many issues with the album artwork not being the right one, and that kinda annoyed me. So I thought there might be a better way to do the same things that they did in the original repo.

## Some Problems

There is no way to get the URL of the current song playing (atleast from my research) through AppleScript (or JXA, Javascript for Automation, which is Apple's AppleScript implementation but in Javascript)

## Why Didn't I Just Fork The Original Repo?

Initially, I thought I would be able to solve my problems pretty easily, but as time progressed, I ended up taking a lot of ideas from the original repo (especially the one with fetching data from https://itunes.apple.com that was pure genius).

In the end, my code ended up being a Javascript and Node.js version of NextFire's original code. It was still a really good learning experience. I just got lazy to fork the repo again and make the changes. Even otherwise, I think this repo has a fairly different codebase to warrant a new repo in itself.

I also removed the entire caching mechanism as it didn't seem to work well for me, and the wrong artwork would often showup on Discord.

## Features

From [anadrajarms21's](https://github.com/anandrajaram21/discord-rpc-apple-music) version, I have added a few things,
No 1: Ability to save the songs artwork to the mac
No 2: Ability to switch between getting the artwork from spotify or apple
No 2: Ability to switch the button from apple to youtube
No 3: A config file in the "config" directory
No 4: Uses my own client-id, from saving Anand's id from ratelimiting
No 5: This is still not working fully, but this will use the artwork from the file and use that as the image, for this to work I'm going to have to setup a server.


## Installation

Prerequisites: Node.js, and NPM.

To run the script, enter the following commands in a terminal window

```bash
npm install -g pm2 # Not necessary, but allows you to use with terminal shut.
git clone https://github.com/GreenDiscord/discord-rpc-apple-music.git
cd discord-rpc-apple-music
npm install
pm2 start index.js # If pm2 is not found, make sure that the globally installed npm packages are in your PATH
```

## Some QOL Features

If you want to run this script on startup, pm2 will do that for you. Just run the command `pm2 startup` and follow the onscreen instructions.

After runnning `pm2 startup`, run the command `pm2 save` to save the list of current processes that are running (to be run on startup)

Stopping the program - `pm2 stop index`

Removing the service from pm2 - `pm2 delete index`

## Uninstall

- Remove the RPC service from pm2 - `pm2 delete index`
- Stop pm2 from running on startup with the command `pm2 unstartup`
- Remove the directory where you cloned the GitHub repo.
- Remove the directory in Documents, where images are saved.

## Credits

The only thing I've done here is refactor some code, and made some areas of the original code a bit more thread safe. Full credits go to NextFire for building an amazing RPC client.
