import { JsonPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { Component, computed, EventEmitter, Input, Output, Signal } from '@angular/core';
import { NgxJsonReaderDiffEntry, NgxJsonReaderDiffResult, NgxJsonReaderValue } from '../types';
import { diffJson } from '../utils';

@Component({
  selector: 'ngx-ngx-json-reader-compare',
  standalone: true,
  imports: [
    NgClass,
    JsonPipe,
    NgForOf,
    NgIf
  ],
  templateUrl: './ngx-json-reader-compare.component.html',
  styleUrl: './ngx-json-reader-compare.component.scss'
})
export class NgxJsonReaderCompareComponent {
  @Input({ required: true }) left!: NgxJsonReaderValue;
  @Input({ required: true }) right!: NgxJsonReaderValue;
  @Input() filter: 'all'|'same'|'diff' = 'all';


  @Output() diffReady = new EventEmitter<NgxJsonReaderDiffResult>();


  private entries: Signal<NgxJsonReaderDiffEntry[]> = computed(() => diffJson(this.left, this.right));

  result: Signal<NgxJsonReaderDiffResult> = computed(() => {
    const es = this.entries();
    const sameCount = es.filter(e => e.kind === 'same').length;
    const diffCount = es.length - sameCount;
    const r = { entries: es, sameCount, diffCount } as NgxJsonReaderDiffResult;
    queueMicrotask(() => this.diffReady.emit(r));
    return r;
  });


  filtered = computed(() => {
    const es = this.result().entries;
    if (this.filter === 'all') return es;
    if (this.filter === 'same') return es.filter(e => e.kind === 'same');
    return es.filter(e => e.kind !== 'same');
  });
}
