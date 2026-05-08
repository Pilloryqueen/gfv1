![](https://img.itch.zone/aW1hZ2UvMzk0Mjg4NC8yMzY0NjU4MC5qcGc=/347x500/TFG%2BGG.jpg)

# GIRL FRAME system implementation for Foundry

This is a game system for [Foundry VTT](http://foundryvtt.com) that provides support for playing [GIRL FRAME](https://anxiousmimicrpgs.itch.io/girl-frame) by Isabelle M. Ruebsaat / Anxiousmimicrpgs

The system is still under active development. It is playable, but I recommend making backups before every update (even minor and patch versions) just to be safe!

All rights to GIRL FRAME belong to Isabelle M. Ruebsaat

## Installation

To install the latest version of the system in Foundry go to Game Systems, Install System and simply provide it this Manifest URL: `https://raw.githubusercontent.com/Pilloryqueen/gfv1/refs/heads/master/system.json`

Please note that the system does not contain any playbooks from the core rule book. If you've bought the book you may be able to get content packs for this system on the [official GIRL FRAME discord](https://discord.gg/yEFEGyVWmS).
You'll also find a thread dedicated to this system under the channel "the-office"

## Development

Install nodejs and clone this repo. Optionally install [the fvtt cli](https://www.npmjs.com/package/@foundryvtt/foundryvtt-cli) globally with `npm i -g @foundryvtt/foundryvtt-cli` - this will allow you to use `fvtt` without `npx` and from anywhere.

Optionally configure `fvtt` with `npx fvtt configure` and follow the instructions.

Use `npm run build` to build the project. This will create a `dist` folder, which you can link to your foundry systems folder with `ln -s /path/to/repo/gfv1/dist /path/to/userData/Data/systems/gfv1`

With `fvtt` configured you will be able to start your local foundry with `npm run foundry`, or launch it however you prefer.

With foundry running on port `30000` you can start a dev server with `npm run dev` the dev sever runs on port `30001`

## Contributions

If you want to contribute to this repository you may do so using the [Fork and Pull Request workflow](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project)

Note that any contributions to this project must be compliant with this system's license, and any additional requirements posed by Foundryvtt. Notably the project maintains a strict "Zero AI" status as defined by [Foundry's AI content policy](https://foundryvtt.com/article/ai-policy/). AI contributions are NOT welcome.
