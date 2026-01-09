# folder-search

<a href="https://marketplace.visualstudio.com/items?itemName=skyfeiz.folder-search" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/v/skyfeiz.folder-search.svg?color=eee&amp;label=VS%20Code%20Marketplace&logo=visual-studio-code" alt="Visual Studio Marketplace Version" /></a>
<a href="https://kermanx.github.io/reactive-vscode/" target="__blank"><img src="https://img.shields.io/badge/made_with-reactive--vscode-%23007ACC?style=flat&labelColor=%23229863"  alt="Made with reactive-vscode" /></a>

Search and open the project folder in VSCode.

## Configurations

```jsonc
// settings.json
{
  "folder-search.alias": {
    "@": "/Users/skyfeiz/Documents/workspace"
  },
  "folder-search.searchPaths": [
    "@/doing", // scan the first-level folders under the @/doing
    "@/*/plugins" // scan the first-level folders under the @/all-folders/plugins
  ]
}
```

- Only scan the first-level folders under the `searchPaths`.
- Support wildcard `*` in the `searchPaths`.
  - not support `**` yet. will be converted to `*`
- Support alias in the `searchPaths`.

## Commands

<!-- commands -->

| Command                         | Title                    |
| ------------------------------- | ------------------------ |
| `search-folder.openSearchPanel` | Open folder Search Panel |

<!-- commands -->

## License

[MIT](./LICENSE.md) License © 2026 [skyfeiz](https://github.com/skyfeiz)
