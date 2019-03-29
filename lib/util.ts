interface Array<T> {
  chunks(chunkSize: number): T[][];
  uniqueBy<K extends keyof T>(prop: K): T[];
}

export default function extend() {
  Object.defineProperty(Array.prototype, "chunks", {
    value(chunkSize: number) {
      let chunks = [];
      for (let i = 0; i < this.length; i += chunkSize)
        chunks.push(this.slice(i, i + chunkSize));
      return chunks;
    }
  });

  Object.defineProperty(Array.prototype, "uniqueBy", {
    value<T, K extends keyof T>(prop: K): T[] {
      return this.filter((obj: T, pos: number) => {
        return this.map((mapObj: T) => mapObj[prop]).indexOf(obj[prop]) === pos;
      });
    }
  });

  Object.defineProperty(Array.prototype, "sum", {
    value(): number {
      return this.reduce((acc: number, cur: number) => {
        return acc + cur;
      }, 0);
    }
  });

  Object.defineProperty(Array.prototype, "maxBy", {
    value<T, K extends keyof T>(prop: K): T {
      let max: T;
      this.forEach((el: T) => {
        if (!max || el[prop] > max[prop]) {
          max = el;
        }
      });
      return max;
    }
  });

  Object.defineProperty(Array.prototype, "minBy", {
    value<T, K extends keyof T>(prop: K): T {
      let min: T;
      this.forEach((el: T) => {
        if (!min || el[prop] < min[prop]) {
          min = el;
        }
      });
      return min;
    }
  });

  Object.defineProperty(Object, "pick", {
    value<T>(obj: T, keys: string[]): Pick<T, keyof T> {
      const selected: { [index: string]: T[keyof T] } = {};
      keys.forEach(key => {
        selected[key] = obj[key as keyof T];
      });
      return selected as Pick<T, keyof T>;
    }
  });

  Object.defineProperty(Object, "max", {
    value(obj: Map<string, number>): string {
      let maxKey: string;
      let maxValue = 0;
      Object.entries(obj).forEach(([k, v]: [string, number]) => {
        if (v > maxValue) {
          maxKey = k;
          maxValue = v;
        }
      });
      return maxKey;
    }
  });
}
