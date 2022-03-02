# Apple Music Discord RPC

Discord RPC Client for Apple Music

## Disclaimer

A lot of the techniques used here have taken inspiration heavily from [this repo](https://github.com/NextFire/apple-music-discord-rpc). A lot of what I did wouldn't have been possible without the ideas from their particular implementation.

## Why

In the repo mentioned before, I faced many issues with the album artwork not being the right one, and that kinda annoyed me. So I thought there might be a better way to do the same things that they did in the original repo.

## Some Problems

Getting the artwork is the biggest problem, everything else is relatively straightforward. There is no way to get the URL of the current song playing (atleast from my research) through AppleScript (or JXA, Javascript for Automation, which is Apple's AppleScript implementation but in Javascript)

## Why Didn't I Just Fork The Original Repo?

Initially, I thought I would be able to solve my problems pretty easily, but as time progressed, I ended up taking a lot of ideas from the original repo (especially the one with fetching data from https://itunes.apple.com that was pure genius).

In the end, my code ended up being a Javascript and Node.js version of NextFire's original code. It was still a really good learning experience. I just got lazy to fork the repo again and make the changes. Even otherwise, I think this repo has a fairly different codebase to warrant a new repo in itself.

I also removed the entire caching mechanism as it didn't seem to work well for me, and the wrong artwork would often showup on Discord.

## Installation

Prerequisites: Node.js, and NPM.

To run the script, enter the following commands in a terminal window

```bash
npm install -g pm2 # Using pm2 so its easy to manage the script
git clone https://github.com/anandrajaram21/discord-rpc-apple-music.git
cd discord-rpc-apple-music
npm install
pm2 start index.js # If pm2 is not found, make sure that the globally installed npm packages are in your PATH
```

## Some QOL Features

If you want to run this script on startup, pm2 will do that for you. Just run the command `pm2 startup` and follow the onscreen instructions.

Stopping the program - `pm2 stop index`
Removing the service from pm2 - `pm2 delete index`

## Uninstall

- Remove the RPC service from pm2 - `pm2 delete index`
- Stop pm2 from running on startup with the command `pm2 unstartup`
- Remove the directory where you cloned the GitHub repo.

## Credits

The only thing I've done here is refactor some code, and made some areas of the original code a bit more thread safe. Full credits go to NextFire for building an amazing RPC client.
