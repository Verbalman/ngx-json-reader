import { JsonPipe, NgIf } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, computed, effect, EventEmitter, inject, Input, Output, signal, Signal } from '@angular/core';
import { NgxJsonReaderCompareComponent } from './ngx-json-reader-compare/ngx-json-reader-compare.component';
import { NgxJsonReaderNodeComponent } from './ngx-json-reader-node/ngx-json-reader-node.component';
import {
  NgxJsonReaderChangeEvent,
  NgxJsonReaderDiffResult,
  NgxJsonReaderFilter,
  NgxJsonReaderHeaders,
  NgxJsonReaderSrcUrls,
  NgxJsonReaderValue,
  NgxJsonReaderViewMode,
} from './types';
import { updateAtPath } from './utils';

@Component({
  selector: 'ngx-ngx-json-reader',
  standalone: true,
  imports: [
    NgIf,
    NgxJsonReaderNodeComponent,
    NgxJsonReaderCompareComponent,
    JsonPipe
  ],
  templateUrl: './ngx-json-reader.component.html',
  styleUrl: 'ngx-json-reader.component.scss',
})
export class NgxJsonReaderComponent {
  #http = inject(HttpClient);
  readonly NgxViewMode = NgxJsonReaderViewMode;

  @Input() srcUrls?: NgxJsonReaderSrcUrls;
  @Input() srcHeaders?: NgxJsonReaderHeaders;
  @Input() data?: NgxJsonReaderValue | NgxJsonReaderValue[];

  @Input() editable = true;
  @Input() rootLabel = 'Test Test';
  @Input() expanded = true;
  @Input() downloadFilename = 'data.json';
  @Input() viewMode = NgxJsonReaderViewMode.TREE;
  @Input() filter = NgxJsonReaderFilter.ALL;

  @Output() dataChange = new EventEmitter<NgxJsonReaderChangeEvent>();
  @Output() diffComputed = new EventEmitter<NgxJsonReaderDiffResult>();
  @Output() error = new EventEmitter<any>();


  #collection = signal<NgxJsonReaderValue>([]);
  collection = computed<NgxJsonReaderValue[]>(() => {
    const collection = this.#collection();
    if (!collection) {
      return [];
    }

    if (Array.isArray(collection)) {
      return collection;
    }

    if (typeof collection === 'object') {
      return [collection];
    }

    return []
  });

  mode: Signal<NgxJsonReaderViewMode> = computed(() => this.viewMode);

  sizeStr: Signal<string | null> = computed(() => {
    const urls = this.srcUrls;
    const collection = this.collection();
    let result = '';

    try {
      if (urls?.length && collection?.length) {
        for (let i = 0; i < urls.length; i++) {
          result += `${urls[i]}: ${new Blob([JSON.stringify(collection[i])]).size ?? 0} B \n`;
        }
      }
      return result;
    } catch (e) {
      return null;
    }
  });

  constructor() {
    effect(() => {
      const urls = this.srcUrls;
      const staticData = this.data;

      if (urls?.length) {
        this.#fetchMany(urls, this.srcHeaders);
      } else if (staticData && Array.isArray(staticData)) {
        this.#collection.set(staticData);
      } else if (staticData) {
        this.#collection.set([staticData]);
      }
    });
  }

  #fetchMany(urls: NgxJsonReaderSrcUrls, headers?: NgxJsonReaderHeaders) {
    const httpHeaders = new HttpHeaders(headers ?? {});
    const fetches = urls.map((url) => this.#http.get<NgxJsonReaderValue>(url, { headers: httpHeaders }).toPromise());
    Promise.all(fetches)
      .then((results) => {
        console.log('results:', results);
        const arr = results.filter(v => v !== undefined) as NgxJsonReaderValue[];
        this.#collection.set(arr);
      })
      .catch((error) => {
        console.error("Cannot fetch data!", error);
      });
  }

  download(index?: number) {
    // const m = this.mode();
    // let content: any;
    // let name = this.downloadFilename;
    // if (m === 'tree') content = this.#rootSig();
    // else {
    //   const i = index ?? 0;
    //   content = this.#roots()[i];
    //   if (!name.endsWith('.json')) name += `.json`;
    //   name = (i === 0 ? 'left-' : 'right-') + name;
    // }
    // const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    // const a = document.createElement('a');
    // a.href = URL.createObjectURL(blob);
    // a.download = name;
    // a.click();
    // URL.revokeObjectURL(a.href);
  }

  onValueChange(e: { path: (string|number)[]; previous: any; current: any; }, index: number) {
    if (this.mode() !== 'tree') return; // editing only in single-tree mode
    const updated = updateAtPath(this.collection()[index], e.path, e.current);
    console.log("updated", updated);
    // @ts-ignore
    const newCollection = [...this.#collection()];
    newCollection[index] = updated;
    this.#collection.set(newCollection);

    // this.#rootSig.set(updated);
    // this.dataChange.emit({ ...e, root: updated });
  }

  onDelete(e: { path: (string|number)[]; previous: any; }) {
    // if (this.mode() !== 'tree') return;
    // const updated = deleteAtPath(this.#rootSig(), e.path);
    // this.#rootSig.set(updated);
    // this.dataChange.emit({ path: e.path, previous: e.previous, current: undefined as any, root: updated });
  }

  expandAll() { document.querySelectorAll('details').forEach(d => (d as HTMLDetailsElement).open = true); }
  collapseAll() { document.querySelectorAll('details').forEach(d => (d as HTMLDetailsElement).open = false); }
}
