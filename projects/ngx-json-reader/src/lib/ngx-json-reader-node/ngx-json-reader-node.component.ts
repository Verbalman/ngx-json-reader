import { JsonPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgxJsonReaderButtonComponent } from '../ngx-json-reader-button/ngx-json-reader-button.component';
import {
  NgxJsonReaderChangeEventType,
  NgxJsonReaderCollectionPath,
  NgxJsonReaderNodeDeleteEmit,
  NgxJsonReaderNodeValueChangeEmit,
  NgxJsonReaderNodeValueType,
  NgxJsonReaderValue,
} from '../types';

@Component({
  selector: 'ngx-ngx-json-reader-node',
  standalone: true,
  imports: [
    JsonPipe,
    NgxJsonReaderButtonComponent
  ],
  templateUrl: './ngx-json-reader-node.component.html',
  styleUrl: './ngx-json-reader-node.component.scss'
})
export class NgxJsonReaderNodeComponent {
  @Input() label!: string | number;
  @Input() value!: NgxJsonReaderValue | any;
  @Input() path: NgxJsonReaderCollectionPath = [];
  @Input() collectionIndex!: number;

  @Input() editable = true;
  @Input() modified = false;
  @Input() expanded = false;

  @Output() valueChange = new EventEmitter<NgxJsonReaderNodeValueChangeEmit>();
  @Output() delete = new EventEmitter<NgxJsonReaderNodeDeleteEmit>();

  readonly valueType = NgxJsonReaderNodeValueType;

  get type(): NgxJsonReaderNodeValueType {
    if (Array.isArray(this.value)) {
      return NgxJsonReaderNodeValueType.ARRAY;
    }

    if (this.value !== null && typeof this.value === NgxJsonReaderNodeValueType.OBJECT) {
      return NgxJsonReaderNodeValueType.OBJECT;
    }

    return NgxJsonReaderNodeValueType.PRIMITIVE;
  }
  get keys(): string[] {
    return (this.type === NgxJsonReaderNodeValueType.OBJECT) ? Object.keys(this.value as any) : [];
  }

  makePath(item: string | number): NgxJsonReaderCollectionPath {
    return [...this.path, item.toString()];
  }

  onInput(e: Event) {
    const input = e.target as HTMLInputElement;
    const prev = this.value;
    const raw = input.value;
    let next: any = raw;
    if (/^-?\d+(\.\d+)?$/.test(raw)) {
      next = Number(raw);
    }
    if (raw === 'true' || raw === 'false') {
      next = raw === 'true';
    }
    if (raw === 'null') {
      next = null;
    }
    this.valueChange.emit({
      type: NgxJsonReaderChangeEventType.UPDATE,
      path: this.path,
      previous: prev,
      current: next,
      collectionIndex: this.collectionIndex,
    });
  }


  onDelete(index: number, prev: any) {
    this.delete.emit({
      type: NgxJsonReaderChangeEventType.DELETE,
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
      type: NgxJsonReaderChangeEventType.ADD,
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
      type: NgxJsonReaderChangeEventType.ADD,
      path: this.path,
      previous: this.value,
      current: arr,
      collectionIndex: this.collectionIndex,
    });
  }
}
