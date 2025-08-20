import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, computed, effect, EventEmitter, inject, Input, Output, signal, Signal } from '@angular/core';
import { NgxJsonReaderNodeComponent } from './ngx-json-reader-node/ngx-json-reader-node.component';
import {
  NgxJsonReaderChangeEvent,
  NgxJsonReaderDiffResult,
  NgxJsonReaderHeaders,
  NgxJsonReaderNodeDeleteEmit,
  NgxJsonReaderNodeValueChangeEmit,
  NgxJsonReaderSrcUrls,
  NgxJsonReaderValue,
  NgxJsonReaderViewMode,
} from './types';
import { deleteAtPath, updateAtPath } from './utils';

@Component({
  selector: 'ngx-ngx-json-reader',
  standalone: true,
  imports: [
    NgxJsonReaderNodeComponent,
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
  @Input() expanded = true;

  @Input() rootLabel = '__DATA__';
  @Input() downloadFilename: string | string[] = 'data.json';

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

  sizeStr: Signal<string> = computed(() => {
    try {
      const collection = this.collection();
      if (!collection?.length) {
        return '';
      }

      let result = '';
      const urls = this.srcUrls;
      const staticData = this.#getStaticData();

      if (urls?.length) {
        for (let i = 0; i < urls.length; i++) {
          result += `${urls[i]}: ${new Blob([JSON.stringify(collection[i])]).size ?? 0} B \n`;
        }
      } else if (staticData.length) {
        for (let i = 0; i < staticData.length; i++) {
          result += `Set ${i + 1}: ${new Blob([JSON.stringify(collection[i])]).size ?? 0} B \n`;
        }
      }
      return result;
    } catch (e) {
      return '';
    }
  });

  constructor() {
    effect(() => {
      const urls = this.srcUrls;
      const staticData = this.#getStaticData();

      if (urls?.length) {
        this.#fetchMany(urls, this.srcHeaders);
      } else {
        this.#setToCollection(staticData);
      }
    });
  }

  download(index: number) {
    try {
      let name = (this.downloadFilename && Array.isArray(this.downloadFilename)) ? this.downloadFilename[index] : this.downloadFilename;
      const collectionItem = this.collection()[index];

      if (!name.endsWith('.json')) {
        name += `.json`;
      }

      const blob = new Blob([JSON.stringify(collectionItem, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = name;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (error) {
      console.error("Cannot download file!", error);
    }
  }

  onValueChange(event: NgxJsonReaderNodeValueChangeEmit) {
    console.log("event", event);
    const {
      path,
      current,
      previous,
      collectionIndex,
    } = event;
    const collectionItem = this.collection()[collectionIndex];
    const updated = updateAtPath(collectionItem, path, current);
    const newCollection = [...this.collection()];
    newCollection[collectionIndex] = updated;
    this.#collection.set(newCollection);
    this.dataChange.emit({
      message: "Updated",
      // options: event,
    });
  }

  onDelete(event: NgxJsonReaderNodeDeleteEmit) {
    const {
      collectionIndex,
      previous,
      path,
    } = event;
    const collectionItem = this.collection()[collectionIndex];
    const updated = deleteAtPath(collectionItem, path);
    const newCollection = [...this.collection()];
    newCollection[collectionIndex] = updated;
    this.#collection.set(newCollection);
    this.dataChange.emit({
      message: "Delete",
      // options: event,
    });
  }

  expandAll() { document.querySelectorAll('details').forEach(d => (d as HTMLDetailsElement).open = true); }
  collapseAll() { document.querySelectorAll('details').forEach(d => (d as HTMLDetailsElement).open = false); }

  #getStaticData() {
    const staticData = this.data;

    if (staticData && Array.isArray(staticData)) {
      return staticData;
    } else if (staticData) {
      return [staticData];
    }

    return [];
  }

  #setToCollection(data: NgxJsonReaderValue) {
    Promise.resolve().then(() => {
      this.#collection.set(data);
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
        this.error.emit()
      });
  }
}
