import { Pool } from "pg";
import sql, { join } from "pg-template-tag";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export function query(text: string, params?: any) {
  return pool.query(text, params);
}

interface valuesOpt {
  key: string;
  def?: any;
  json: boolean;
}

export function values(objects: any[], ...vals: Array<string | valuesOpt>) {
  return join(
    objects.map(obj => {
      const valueSet: string = join(
        vals.map(
          (val: string | valuesOpt): string[] => {
            switch (typeof val) {
              case "object":
                const { key, def = null, json = false } = val as valuesOpt;
                let data = obj[key] || def;
                if (json) {
                  data = JSON.stringify(data);
                }
                return sql`${data}`;
              case "string":
                return sql`${obj[val]}`;
              default:
                throw new Error(
                  "Vals should be either strings describing an object path, or objects."
                );
            }
          }
        )
      );
      return sql`(${valueSet})`;
    }),
    ", "
  );
}
