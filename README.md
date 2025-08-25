# NgxJsonReader

[![npm version](https://img.shields.io/npm/v/ngx-json-reader.svg)](https://www.npmjs.com/package/ngx-json-reader)
[![GitHub stars](https://img.shields.io/github/stars/Verbalman/ngx-json-reader.svg?style=social)](https://github.com/Verbalman/ngx-json-reader)

**ngx-json-reader** is a lightweight Angular 17+ library for working with JSON in your applications.
It provides a standalone component that can:

- Load JSON from URLs or directly from data inputs
- Render tree view with expand/collapse and inline editing
- Compare multiple JSON sources side-by-side
- Download JSON back to file

Perfect for developer tools, admin dashboards, or any Angular app that needs an interactive JSON viewer/editor.

## Installation

```bash
npm install ngx-json-reader
```

## Example usage

```typescript
import { Component } from '@angular/core';
import { JsonReaderComponent } from 'ngx-json-reader';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [JsonReaderComponent],
  template: `
    <!-- Single JSON, editable -->
    <ngx-json-reader
      [data]="{ hello: 'world', list: [1,2,3] }"
      [editable]="false"
    />

    <!-- Compare two JSONs -->
    <ngx-json-reader
      [data]="[fisrt, second]"
      [downloadFilename]="downloadFilename"
    />
    
    <!-- Load from URLs -->
    <ngx-json-reader
      [srcUrls]="srcUrls"
      [downloadFilename]="downloadFilename"
    />
  `
})
export class AppComponent {
  fisrt = { a: 1, b: { x: 10, y: [1,2] } };
  second = { a: 1, b: { x: 11, y: [1,2,3] }, d: null };
  srcUrls = [
    './some/path/one.json',
    './some/path/two.json',
  ];
  downloadFilename = [
    'new-one.json',
    'new-two.json',
  ];
}
```

## Inputs / Outputs

### Inputs

- `srcUrls?: string[]`: load JSONs from URLs
- `srcHeaders?: Record<string, string>`: headers for load JSONs from URLs
- `data?: unknown | unknown[]`: single or multiple JSON objects
- `editable = true`: enable inline editing
- `modified = false`: enable add/remove action
- `expanded = true`: expand all JSONs by default
- `downloadFilename: string | string[] = 'data.json'`: filename when downloading

### Outputs

- `dataChange`: emits on JSON edits
