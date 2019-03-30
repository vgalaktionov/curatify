export function chunks<T>(arr: T[], chunkSize: number): T[][] {
  let chunks = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
}

export function uniqueBy<T, K extends keyof T>(arr: T[], prop: K): T[] {
  return arr.filter((obj: T, pos: number) => {
    return arr.map((mapObj: T) => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}

export function sum(arr: number[]): number {
  return arr.reduce((acc: number, cur: number) => {
    return cur ? acc + cur : acc;
  }, 0);
}

export function maxBy<T, K extends keyof T>(arr: T[], prop: K): T {
  let max: T;
  arr.forEach((el: T) => {
    if (!max || el[prop] > max[prop]) {
      max = el;
    }
  });
  return max;
}

export function minBy<T, K extends keyof T>(arr: T[], prop: K): T {
  let min: T;
  arr.forEach((el: T) => {
    if (!min || el[prop] < min[prop]) {
      min = el;
    }
  });
  return min;
}

export function pick<T>(obj: T, keys: string[]): Pick<T, keyof T> {
  const selected: { [index: string]: T[keyof T] } = {};
  keys.forEach(key => {
    selected[key] = obj[key as keyof T];
  });
  return selected as Pick<T, keyof T>;
}

export function maxKey(obj: Map<string, number>): string {
  let maxKey: string;
  let maxValue = 0;
  Object.entries(obj).forEach(([k, v]: [string, number]) => {
    if (v > maxValue || maxValue === 0) {
      maxKey = k;
      maxValue = v;
    }
  });
  return maxKey;
}
