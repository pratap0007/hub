import { Api } from "./";
import * as fs from "fs";

export class FakeHub implements Api {
  dataDir: string;

  constructor(dataDir: string) {
    this.dataDir = dataDir;
  }

  resources() {
    const data = `${this.dataDir}/resources.json`;
    const ret = () => JSON.parse(fs.readFileSync(data).toString());
    return new Promise((resolve, reject) =>
      setTimeout(() => resolve(ret()), 1000)
    );
  }
}
