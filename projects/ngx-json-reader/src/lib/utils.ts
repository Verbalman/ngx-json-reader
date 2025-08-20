export function isObject(v: any): v is Record<string, any> {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

export function cloneDeep<T>(v: T): T {
  return structuredClone(v);
}


export function updateAtPath(root: any, path: (string | number)[], value: any) {
  const draft = cloneDeep(root);
  let cur: any = draft;

  for (let i = 0; i < path.length - 1; i++) {
    cur = cur[path[i] as any];
  }

  const last = path[path.length - 1];
  if (Array.isArray(cur) && typeof last === 'number') {
    cur[last] = value;
  } else {
    cur[last as any] = value;
  }

  return draft;
}


export function deleteAtPath(root: any, path: (string | number)[]) {
  const draft = cloneDeep(root);
  let cur: any = draft;

  for (let i = 0; i < path.length - 1; i++) {
    cur = cur[path[i] as any];
  }

  const last = path[path.length - 1];
  if (Array.isArray(cur) && typeof last === 'number') {
    cur.splice(last, 1);
  } else {
    delete cur[last as any];
  }

  return draft;
}


export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false;
    return true;
  }
  if (isObject(a) && isObject(b)) {
    const ak = Object.keys(a).sort();
    const bk = Object.keys(b).sort();
    if (ak.length !== bk.length) return false;
    for (let i = 0; i < ak.length; i++) if (ak[i] !== bk[i]) return false;
    for (const k of ak) if (!deepEqual(a[k], b[k])) return false;
    return true;
  }
  return false;
}

export function diffJson(a: any, b: any, basePath: (string | number)[] = []): import('./types').NgxJsonReaderDiffEntry[] {
  const entries: import('./types').NgxJsonReaderDiffEntry[] = [];


  const push = (path: (string | number)[], kind: any, av: any, bv: any) => entries.push({path, kind, a: av, b: bv});


  if (a === undefined && b !== undefined) {
    push(basePath, 'added', a, b);
    return entries;
  }
  if (a !== undefined && b === undefined) {
    push(basePath, 'removed', a, b);
    return entries;
  }


  if (deepEqual(a, b)) {
    push(basePath, 'same', a, b);
    return entries;
  }


  const bothArrays = Array.isArray(a) && Array.isArray(b);
  const bothObjects = isObject(a) && isObject(b);


  if (bothArrays) {
    const len = Math.max(a.length, b.length);
    for (let i = 0; i < len; i++) {
      const na = a[i];
      const nb = b[i];
      entries.push(...diffJson(na, nb, [...basePath, i]));
    }
    return entries;
  }
  if (bothObjects) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of keys) {
      entries.push(...diffJson(a[k], b[k], [...basePath, k]));
    }
    return entries;
  }


// primitive or different types
  push(basePath, 'changed', a, b);
  return entries;
}
