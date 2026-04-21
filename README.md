![](https://img.itch.zone/aW1hZ2UvMzk0Mjg4NC8yMzY0NjU4MC5qcGc=/347x500/TFG%2BGG.jpg)

# GIRL FRAME system implementation for Foundry

This is a game system for [Foundry VTT](http://foundryvtt.com) that provides support for playing [GIRL FRAME](https://anxiousmimicrpgs.itch.io/girl-frame) by Isabelle M. Ruebsaat / Anxiousmimicrpgs

The system is still under active development. It is playable, but I recommend making backups before every update (even minor and patch versions) just to be safe!

All rights to GIRL FRAME belong to Isabelle M. Ruebsaat

## Installation

To install the latest version of the system in Foundry go to Game Systems, Install System and simply provide it this Manifest URL: `https://raw.githubusercontent.com/Pilloryqueen/gfv1/refs/heads/master/system.json`

Please note that the system does not contain any playbooks from the core rule book. If you've bought the book you may be able to get content packs for this system by asking around on the [official GIRL FRAME discord](https://discord.gg/yEFEGyVWmS). You'll find a thread dedicated to this system under the channel "the-office"

## Development

The easiest way to test changes made to the system is to have your local files in your foundry `systems` folder. In windows this is usually located at `%LocalAppData%/FoundryVTT/Data/systems/` - Note that the folder for the system MUST have the name `gfv1` exactly as the `id` in `system.json`

To ensure consistency in all commits please run the command `npm install` to setup all development dependencies. This enables automatic formatting and
ensures that `index.css` is compiled from [less](<https://en.wikipedia.org/wiki/Less_(style_sheet_language)>) rather than manually updated.

If your system does not have an `npm` command you need to install [node.js](https://nodejs.org/en)

With the dependencies installed you can use the command `npm run format` to automatically format all files, and `npm run less` to compile changes to `.less` files

These are automatically run before commit as necceasry

## Contributions

If you want to contribute to this repository you may do so using the [Fork and Pull Request workflow](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project)

Note that any contributions to this project must be compliant with this system's license, and any additional requirements posed by Foundryvtt. Notably the project maintains a strict "Zero AI" status as defined by [Foundry's AI content policy](https://foundryvtt.com/article/ai-policy/). AI contributions are NOT welcome.
