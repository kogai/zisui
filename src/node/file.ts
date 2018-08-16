import fs from "fs";
import path from "path";
import { Buffer } from "buffer";
import * as mkdirp from "mkdirp";
import { MainOptions } from "./types";

export class FileSystem {
  constructor(private opt: MainOptions) {
  }

  save(kind: string, story: string, buffer: Buffer) {
    const name = this.opt.flat ? (kind + "_" + story).replace(/\//g, "_") : kind + "/" + story;
    const filePath = path.join(this.opt.outDir, name + ".png");
    return new Promise((resolve, reject) => {
      mkdirp.sync(path.dirname(filePath));
      fs.writeFile(filePath, buffer, (err) => {
        if (err) reject(err);
        this.opt.logger.log("Screenshot stored:", this.opt.logger.color.magenta(filePath));
        resolve();
      });
    });
  }
}
