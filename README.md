# Office Editor

Full offline Writer, Calc and Impress, supplied by the upstream [ZetaOffice / LibreOffice suite](https://zetaoffice.net/) through [ZetaJS](https://github.com/allotropia/zetajs). Opens and saves ODT, ODS and ODP, with the suite's own Office-format filters and editor UI.

Taskasaur provides the file picker, versioned core storage and this small integration wrapper. The plugin does not implement a document model, spreadsheet grid, formula engine or slide editor. Engine assets ship with Taskasaur; web first use verifies and caches the pinned runtime locally for offline use. WebAssembly threads and cross-origin isolation are required. Unsupported WebViews report the missing capability.

Use the app's Save and Export controls for workspace files. Normal Save in the upstream suite also commits the opened file through core. The suite's filesystem dialogs use its virtual filesystem.

This optional plugin runs within the Taskasaur plugin framework and depends on required core file storage. Its independently signed package is installed locally on each device.

```sh
npm ci
npm run typecheck
npm run build
```

Package only `dist/` with the Taskasaur packaging CLI and a private publisher key. Publish the signed ZIP at an immutable HTTPS URL and register its URL and SHA-256 in [taskasaur-plugin-inventory](https://github.com/taskasaur/taskasaur-plugin-inventory). See [the plugin specification](https://github.com/taskasaur/taskasaur-plugin-inventory/blob/main/docs/plugin-specification.md) and [the core office integration](https://github.com/taskasaur/taskasaur/blob/main/docs/office-engine.md). Never commit publisher keys.
