import fs from "fs";
import path from "path";
import { Buffer } from "buffer";
import * as mkdirp from "mkdirp";
import { MainOptions } from "./types";

export class FileSystem {
  constructor(private opt: MainOptions) {}

  save(kind: string, story: string, buffer: Buffer) {
    const name = this.opt.flat
      ? (kind + "-" + story).replace(/\//g, "").replace(/\s/g, "-")
      : kind + "/" + story;
    const filePath = path.join(this.opt.outDir, name + ".png");
    return new Promise<string>((resolve, reject) => {
      mkdirp.sync(path.dirname(filePath));
      fs.writeFile(filePath, buffer, err => {
        if (err) reject(err);
        resolve(filePath);
      });
    });
  }
}
