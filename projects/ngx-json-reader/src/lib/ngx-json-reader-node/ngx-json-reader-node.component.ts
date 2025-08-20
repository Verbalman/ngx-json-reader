import { JsonPipe, NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  NgxJsonReaderNodeDeleteEmit,
  NgxJsonReaderNodeValueChangeEmit,
  NgxJsonReaderValue,
} from '../types';

@Component({
  selector: 'ngx-ngx-json-reader-node',
  standalone: true,
  imports: [
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    NgForOf,
    NgIf,
    JsonPipe
  ],
  templateUrl: './ngx-json-reader-node.component.html',
  styleUrl: './ngx-json-reader-node.component.scss'
})
export class NgxJsonReaderNodeComponent {
  @Input() label!: string | number;
  @Input() value!: NgxJsonReaderValue | any;
  @Input() path: (number | string)[] = [];
  @Input() collectionIndex!: number;
  @Input() expanded = false;
  @Input() editable = true;

  @Output() valueChange = new EventEmitter<NgxJsonReaderNodeValueChangeEmit>();
  @Output() delete = new EventEmitter<NgxJsonReaderNodeDeleteEmit>();


  get type(): 'object'|'array'|'primitive' {
    if (Array.isArray(this.value)) return 'array';
    if (this.value !== null && typeof this.value === 'object') return 'object';
    return 'primitive';
  }
  get keys(): string[] { return this.type==='object' ? Object.keys(this.value as any) : []; }

  makePath(item: string | number) {
    return [...this.path, item.toString()];
  }

  onInput(e: Event) {
    const input = e.target as HTMLInputElement;
    const prev = this.value;
    const raw = input.value;
    let next: any = raw;
    if (/^-?\d+(\.\d+)?$/.test(raw)) next = Number(raw);
    if (raw === 'true' || raw === 'false') next = raw === 'true';
    if (raw === 'null') next = null;
    this.valueChange.emit({
      path: this.path,
      previous: prev,
      current: next,
      collectionIndex: this.collectionIndex,
    });
  }


  onDelete(index: number, prev: any) {
    this.delete.emit({
      path: [...this.path, index],
      previous: prev,
      collectionIndex: this.collectionIndex,
    });
  }


  addObjectProp() {
    const key = prompt('New property name');
    if (!key) return;
    const prev = (this.value as any)[key];
    if (prev !== undefined) return alert('Key already exists');
    this.valueChange.emit({
      path: [...this.path, key],
      previous: undefined,
      current: '',
      collectionIndex: this.collectionIndex,
    });
  }


  addArrayItem() {
    const arr = Array.isArray(this.value) ? [...(this.value as any[])] : [];
    arr.push('');
    this.valueChange.emit({
      path: this.path,
      previous: this.value,
      current: arr,
      collectionIndex: this.collectionIndex,
    });
  }

  protected readonly Array = Array;
}
