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

In the end, my code ended up being a Javascript and Node.js version of NextFire's original code. It was still a really good learning experience.

I also removed the entire caching mechanism as it didn't seem to work well for me, and the wrong artwork would often showup on Discord.

## Installation

Will be updated once I get it installed properly myself

## Credits

The only thing I've done here is refactor some code, and made some areas of the original code a bit more thread safe. Full credits go to NextFire for building an amazing RPC client.
