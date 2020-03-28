import {NextFunction, Request, Response, Router} from 'express';
import {BAD_REQUEST, OK, INTERNAL_SERVER_ERROR} from 'http-status-codes';
import {ParamsDictionary} from 'express-serve-static-core';
import {paramMissingError} from '@shared/constants';
import * as fs from 'fs';
import {ResponseDataArraySpec} from "../../spec/responseDataArray.spec";

// Init shared
const router = Router();

// TODO: Add length and end time calculating
// TODO: Add "x" column based start time, frequency and samples number
function processFile(buffer: Buffer) {
  return new Promise((resolve, reject) => {
    const lines = buffer.toString().split(/\r?\n/);

    const responseData = new ResponseDataArraySpec();

    // process file metadata
    const meta = lines.splice(0, 12)
        .filter((line: string) => line.split('')[0] !== '#')
        .map((el: string) => el.trim());

    responseData.meta.channels = +meta[0];
    responseData.meta.samples = +meta[1];
    responseData.meta.frequency = +meta[2];
    responseData.meta.startTime = `${meta[3]} ${meta[4]}`;

    meta[5].split(';').forEach((val: string, idx: number) => {
      const columnName = `y${idx}`;
      responseData.names.set(columnName, val);
      responseData.columns.push([]);
      responseData.columns[idx].push(columnName);
    });

    console.log(responseData.columns);

    // print all lines
    lines.forEach((line) => {
      console.log(line);
      line.split(' ').forEach((val: string, idx: number) => {
        if (idx >= responseData.columns.length) return;
        responseData.columns[idx].push(+val);
      });
    });

    resolve(responseData);
  });
}

/* GET users listing. */
router.post('/', function (req: Request, res: Response, next: NextFunction) {
  if (req.files === undefined) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }

  fs.promises.readFile(req.files.file.path)
      .then(async (buffer) => {
        await processFile(buffer)
            .then((data) => {
              console.log(JSON.stringify(data, null, 2));
              res.status(OK).json(data);
            })
            .catch((err: Error) => {
              console.error(err);
              res.status(BAD_REQUEST).send(err);
            });
      })
      .catch((err) => {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).send(err);
      });
});

export default router;