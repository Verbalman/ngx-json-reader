# NgxJsonReader

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
      [editable]="true"
      viewMode="tree">
    </ngx-json-reader>

    <!-- Compare two JSONs -->
    <ngx-json-reader
      [data]="[leftJson, rightJson]"
      viewMode="compare"
      filter="diff">
    </ngx-json-reader>
  `
})
export class AppComponent {
  leftJson = { a: 1, b: { x: 10, y: [1,2] } };
  rightJson = { a: 1, b: { x: 11, y: [1,2,3] }, d: null };
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
