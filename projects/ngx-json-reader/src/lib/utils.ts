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
