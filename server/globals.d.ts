interface Array<T> {
  chunks(chunkSize: number): T[][];
  uniqueBy<K extends keyof T>(prop: K): T[];
  sum(): number;
  maxBy<K extends keyof T>(prop: K): T;
  minBy<K extends keyof T>(prop: K): T;
}

interface ObjectConstructor {
  max(obj: Map<string, number>): string;
  pick<T>(obj: T, keys: string[]): Partial<Pick<T, keyof T>>;
}
