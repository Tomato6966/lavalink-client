# SearchPlatform

Combination of [LavalinkSearchPlatform ](lavalinksearchplatform.md)and [ClientSearchPlatform](clientsearchplatform.md)

> _See each page for more details_

```typescript
export type SearchPlatform = LavalinkSearchPlatform | ClientSearchPlatform;
```

You can put a SearchPlatform into player.search({ source: [SearchPlatform](./) }), but also do:

``player.search({ query: `${SearchPlatform}:${queryString}`});``

Example: ``player.search({ query: `ytsearch:Adele Hello` }, interaction.user);``
