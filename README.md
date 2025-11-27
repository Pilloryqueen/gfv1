![](https://img.itch.zone/aW1hZ2UvMzk0Mjg4NC8yMzY0NjU4MC5qcGc=/347x500/TFG%2BGG.jpg)

# GIRL FRAME system implementation for Foundry

This is a game system for [Foundry VTT](http://foundryvtt.com) that provides support for playing [GIRL FRAME](https://anxiousmimicrpgs.itch.io/girl-frame) by Isabelle M. Ruebsaat / Anxiousmimicrpgs

The system is currently under EARLY development, and may be subject to rapid and possibly breaking changes! Use at your own risk.

All rights to GIRL FRAME belong to Isabelle M. Ruebsaat

## Installation

To install the latest version of the system in Foundry go to Game Systems, Install System and simply provide it this Manifest URL: `https://raw.githubusercontent.com/Pilloryqueen/gfv1/refs/heads/master/system.json`

## Development

The easiest way to make a develoment version of the system is to checkout this repo in your foundry `systems` folder usually located at `%LocalAppData%/FoundryVTT/Data/systems`

When running Foundry on your development version of this repository it may create changes to the compendium databases in `/packs`. To avoid committing these changes run the command `git ls-files 'packs/**/*' | xargs git update-index --skip-worktree` to tell git not to care about changes to these files.

If you need to actually make changes to the packs use `git ls-files 'packs/**/*' | xargs git update-index --no-skip-worktree` to remove the skip, then `git add -f packs/**/*` to add the files, commit, and then update-index --skip-worktree as before. This is to avoid having constant merge conflicts every time there are quiet changes to the packs.

Do not edit `index.css` manually. It is compiled from the `.less` files in `/less`. An easy way to always compile changes you make to the `.less` files is using the VSCode plugin [Easy LESS](https://marketplace.visualstudio.com/items?itemName=mrcrowl.easy-less)
