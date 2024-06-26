import * as crypto from "crypto";
import * as fs from "fs";
import { log } from "./logger";

export function compareFiles(
  path1: string,
  path2: string,
  callback: (result: boolean) => void,
  callbackOnError: (result: string) => void
) {
  try {
    const hash1 = crypto.createHash("sha256");
    const stream1 = fs.createReadStream(path1);

    stream1.on("data", (data) => {
      hash1.update(data);
    });

    stream1.on("end", () => {
      const hash1Digest = hash1.digest("base64");

      const hash2 = crypto.createHash("sha256");
      const stream2 = fs.createReadStream(path2);

      stream2.on("data", (data) => {
        hash2.update(data);
      });

      stream2.on("end", () => {
        const hash2Digest = hash2.digest("base64");

        if (hash1Digest === hash2Digest) {
          log.info(
            "compareFiles",
            `${path1} AND ${path2} are identical.  hashes: ${hash1Digest} <==> ${hash2Digest}`
          );
          callback(true);
        } else {
          log.info(
            "compareFiles",
            `${path1} AND ${path2} are different. hashes: ${hash1Digest} <==> ${hash2Digest}`
          );
          callback(false);
        }
      });
    });
  } catch (e) {
    callbackOnError(`${e}`);
  }
}
