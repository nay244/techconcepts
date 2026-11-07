# Anatomy kit (vendored)

These files come from the Anatomy kit by Ryan, https://github.com/wheresryan22/anatomy, under the MIT licence (see `LICENSE` here).

Only three files of the kit's `kit/` folder are vendored:

- `iso-kit.ts`
- `lathe.mjs`
- `tube.mjs`

They are unchanged apart from import paths: `lathe.mjs` and `tube.mjs` imported `./iso-kit.mjs` and now import `./iso-kit.ts`. Nothing else in them was edited.

The kit's `iso.css` is not vendored as a file. Its rules (the `ISO_CSS` string in `iso-kit.ts`) are copied into `../lumen.css`, together with the site's lumen finish.

`LICENSE` is the repository's top-level MIT licence file, copied as it is.
