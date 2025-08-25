import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, computed, effect, ElementRef, EventEmitter, inject, Input, Output, QueryList, signal, Signal, ViewChildren } from '@angular/core';
import { NgxJsonReaderButtonComponent } from './ngx-json-reader-button/ngx-json-reader-button.component';
import { NgxJsonReaderNodeComponent } from './ngx-json-reader-node/ngx-json-reader-node.component';
import {
  NgxJsonReaderChangeEvent,
  NgxJsonReaderData,
  NgxJsonReaderHeaders,
  NgxJsonReaderNodeDeleteEmit,
  NgxJsonReaderNodeValueChangeEmit,
  NgxJsonReaderSrcUrls,
  NgxJsonReaderValue,
} from './types';
import { deleteAtPath, updateAtPath } from './utils';

@Component({
  selector: 'ngx-ngx-json-reader',
  standalone: true,
  imports: [
    NgxJsonReaderNodeComponent,
    NgxJsonReaderButtonComponent,
  ],
  templateUrl: './ngx-json-reader.component.html',
  styleUrl: 'ngx-json-reader.component.scss',
})
export class NgxJsonReaderComponent {
  #http = inject(HttpClient);
  readonly #defaultRootLabel = '__root__';

  @Input() srcUrls?: NgxJsonReaderSrcUrls;
  @Input() srcHeaders?: NgxJsonReaderHeaders;
  @Input() data?: NgxJsonReaderData;

  @Input() editable = true;
  @Input() modified = false;
  @Input() expanded = true;

  @Input() rootLabel?: string;
  @Input() downloadFilename: string | string[] = 'data.json';

  @Output() dataChange = new EventEmitter<NgxJsonReaderChangeEvent>();
  @Output() error = new EventEmitter<any>();

  @ViewChildren('collectionElement') collectionElements!: QueryList<ElementRef<HTMLDivElement>>;

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

  getSetSize(index: number) {
    const collection = this.collection();
    const collectionItem = collection[index];
    try {
      return `${new Blob([JSON.stringify(collectionItem)]).size ?? 0} B \n`;
    } catch (e) {
      return '';
    }
  }

  getRootLabel(index: number) {
    if (this.rootLabel) {
      return this.rootLabel;
    }

    if (Array.isArray(this.downloadFilename) && this.downloadFilename.length) {
      return this.downloadFilename[index];
    }

    if (this.srcUrls?.length) {
      return this.srcUrls[index];
    }

    return this.#defaultRootLabel;
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
    const {
      path,
      current,
      collectionIndex,
    } = event;
    const collectionItem = this.collection()[collectionIndex];
    const updated = updateAtPath(collectionItem, path, current);
    const newCollection = [...this.collection()];
    newCollection[collectionIndex] = updated;
    this.#collection.set(newCollection);
    this.dataChange.emit({ ...event });
  }

  onDelete(event: NgxJsonReaderNodeDeleteEmit) {
    const {
      collectionIndex,
      path,
    } = event;
    const collectionItem = this.collection()[collectionIndex];
    const updated = deleteAtPath(collectionItem, path);
    const newCollection = [...this.collection()];
    newCollection[collectionIndex] = updated;
    this.#collection.set(newCollection);
    this.dataChange.emit({ ...event });
  }

  expandOneCollection(index: number) {
    this.collectionElements.get(index)?.nativeElement.querySelectorAll('details').forEach(d => (d as HTMLDetailsElement).open = true);
  }
  expandAll() {
    this.collectionElements.forEach((ref) => {
      ref?.nativeElement.querySelectorAll('details').forEach(d => (d as HTMLDetailsElement).open = true);
    });
  }
  collapseOneCollection(index: number) {
    this.collectionElements.get(index)?.nativeElement.querySelectorAll('details').forEach(d => (d as HTMLDetailsElement).open = false);
  }
  collapseAll() {
    this.collectionElements.forEach((ref) => {
      ref?.nativeElement.querySelectorAll('details').forEach(d => (d as HTMLDetailsElement).open = false);
    });
  }

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
