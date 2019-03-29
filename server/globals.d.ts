declare module "pg-template-tag";

interface Array<T> {
  chunks(chunkSize: number): T[][];
  uniqueBy<K extends keyof T>(prop: K): T[];
  sum(): number;
}

interface ObjectConstructor {
  max(obj: Map<string, number>): string;
  pick<T>(obj: T, keys: string[]): Partial<Pick<T, keyof T>>;
}
