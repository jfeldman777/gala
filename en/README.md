# English edition

Add translated pages under `en/…` and register them in `pages.en.json` with the **same numeric `id`** as in Russian `pages.json`.

Example:

```json
{
  "id": "1.2",
  "section": "1. Crumbs",
  "md": "en/1. Crumbs/1.2. Rules of fruitful discussion.md"
}
```

- UI language: `RU` / `EN` on the cover and in the sidebar, or `?lang=en`
- Audio: not used for English yet (Listen stays hidden)
- Drafts: unfinished EN pages can end with `@` before `.md`, or simply omit them from `pages.en.json`
- Images: keep using root files, e.g. `![[дилтс.png]]`
