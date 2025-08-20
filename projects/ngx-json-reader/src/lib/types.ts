
export enum  NgxJsonReaderNodeValueType {
  OBJECT = 'object',
  ARRAY = 'array',
  PRIMITIVE = 'primitive',
}

export enum NgxJsonReaderChangeEventType {
  ADD = 'add',
  UPDATE = 'update',
  DELETE = 'delete'
}


export interface NgxJsonReaderObject {
  [k: string]: NgxJsonReaderValue;
}
export type NgxJsonReaderPrimitive = string | number | boolean | null;
export type NgxJsonReaderArray = NgxJsonReaderValue[];
export type NgxJsonReaderValue = NgxJsonReaderPrimitive | NgxJsonReaderObject | NgxJsonReaderArray;

export type NgxJsonReaderCollectionPath = (string | number)[];

export type NgxJsonReaderSrcUrls = string[];
export type NgxJsonReaderHeaders = Record<string, string>;
export type NgxJsonReaderData = NgxJsonReaderValue | NgxJsonReaderValue[];


export interface NgxJsonReaderChangeEvent {
  type: NgxJsonReaderChangeEventType,
  path: NgxJsonReaderCollectionPath;
  previous: NgxJsonReaderValue | undefined;
  current?: NgxJsonReaderValue | undefined;
  collectionIndex: number;
}

export interface NgxJsonReaderNodeValueChangeEmit {
  type: NgxJsonReaderChangeEventType,
  path: NgxJsonReaderCollectionPath;
  previous: any;
  current: any;
  collectionIndex: number;
}

export interface NgxJsonReaderNodeDeleteEmit {
  type: NgxJsonReaderChangeEventType,
  path: NgxJsonReaderCollectionPath;
  previous: any;
  collectionIndex: number;
}
