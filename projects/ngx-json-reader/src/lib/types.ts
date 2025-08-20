
export interface NgxJsonReaderObject { [k: string]: NgxJsonReaderValue }
export type NgxJsonReaderPrimitive = string | number | boolean | null;
export type NgxJsonReaderArray = NgxJsonReaderValue[];

export type NgxJsonReaderValue = NgxJsonReaderPrimitive | NgxJsonReaderObject | NgxJsonReaderArray;

export type NgxJsonReaderSrcUrls = string[];
export type NgxJsonReaderHeaders = Record<string, string>;

export enum NgxJsonReaderViewMode {
  TREE = 'tree',
  COMPARE = 'compare',
  DIFF = 'diff',
}

export enum NgxJsonReaderFilter {
  ALL = 'all',
  SAME = 'same',
  DIFF = 'diff',
}

export interface NgxJsonReaderChangeEvent {
  path: (string | number)[];
  previous: NgxJsonReaderValue | undefined;
  current: NgxJsonReaderValue | undefined;
  root: NgxJsonReaderValue;
}


export interface NgxJsonReaderDiffEntry {
  path: (string|number)[];
  a?: NgxJsonReaderValue; // left
  b?: NgxJsonReaderValue; // right
  kind: 'added' | 'removed' | 'changed' | 'same';
}
export interface NgxJsonReaderDiffResult {
  entries: NgxJsonReaderDiffEntry[];
  sameCount: number;
  diffCount: number;
}
