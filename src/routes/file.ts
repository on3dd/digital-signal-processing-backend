import {NextFunction, Request, Response, Router} from 'express';
import {BAD_REQUEST, OK, INTERNAL_SERVER_ERROR} from 'http-status-codes';
import {paramMissingError} from '@shared/constants';
import * as fs from 'fs';
import {ResponseDataArraySpec, ResponseDataArraySpecJSON} from "../../spec/responseDataArray.spec";
import {strMapToObj} from "@shared/functions";

// Init shared
const router = Router();

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
            .then((data: ResponseDataArraySpec) => {
              const responseDataJSON = new ResponseDataArraySpecJSON(
                  data.columns,
                  strMapToObj(data.types),
                  strMapToObj(data.names),
                  strMapToObj(data.colors),
                  data.meta,
              );

              // console.log(JSON.stringify(responseDataJSON, null, 2));
              res.status(OK).json(responseDataJSON);
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

function processFile(buffer: Buffer): Promise<ResponseDataArraySpec> {
  return new Promise((resolve, reject) => {
    const lines = buffer.toString().split(/\r?\n/);

    const responseData = new ResponseDataArraySpec();

    // process file metadata
    const meta = lines.splice(0, 12)
        .filter((line: string) => line.split('')[0] !== '#')
        .map((el: string) => el.trim());

    responseData.meta.channels = +meta[0];
    responseData.meta.samples = +meta[1];
    responseData.meta.sampleRate = +meta[2];

    // initiate x axis
    responseData.columns.push([]);
    responseData.columns[0].push('x');
    responseData.types.set('x', 'x');

    // process start and end time and record total length
    const startDate = new Date(responseData.meta.startTime);
    const frequency = 1 / responseData.meta.sampleRate;

    let tempTime = startDate.getTime();
    for (let i = 0; i < responseData.meta.samples; i++) {
      tempTime += frequency * 1000;
      responseData.columns[0].push(tempTime);
    }

    const endDate = new Date(tempTime);
    responseData.meta.startTime = startDate;
    responseData.meta.endTime = endDate;
    responseData.meta.recordingLength = getRecordingLengthString(endDate.getTime() - startDate.getTime());

    // console.log('samples:', responseData.meta.samples);
    // console.log(responseData.meta.startTime);
    // console.log(responseData.meta.endTime);

    // chart colors
    const colors = [
      '#2ecc71', '#e74c3c', '#3498db', '#f1c40f', '#9b59b6', '#1abc9c', '#e67e22', // default colors
      '#27ae60', '#c0392b', '#2980b9', '#f39c12', '#8e44ad', '#16a085', '#d35400', // darker default colors
    ];

    // initiate other columns
    meta[5].split(';').forEach((val: string, idx: number) => {
      const columnName = `y${idx}`;
      responseData.types.set(columnName, 'line');
      responseData.names.set(columnName, val);
      responseData.colors.set(columnName, colors[idx % colors.length]);
      responseData.columns.push([]);
      responseData.columns[idx + 1].push(columnName);
    });

    // console.log(responseData.types);
    // console.log(responseData.names);
    // console.log(responseData.colors);

    // print all lines
    lines.forEach((line) => {
      // console.log(line);
      line.split(' ').forEach((val: string, idx: number) => {
        if (idx >= responseData.columns.length - 1) return;
        responseData.columns[idx + 1].push(+val);
      });
    });

    resolve(responseData);
  });
}

function getRecordingLengthString(length: number): string {
  const dayLength = 24 * 60 * 60 * 1000;
  const hourLength = 60 * 60 * 1000;
  const minuteLength = 60 * 1000;
  const secondLength = 1000;

  const days = Math.floor(length / dayLength);
  const hours = Math.floor((length - days * dayLength) / hourLength);
  const minutes = Math.floor((length - days * dayLength - hours * hourLength) / minuteLength);
  const seconds = Math.floor((length - days * dayLength - hours * hourLength - minutes * minuteLength) / secondLength);
  const milliseconds = length - days * dayLength - hours * hourLength - minutes * minuteLength - seconds * secondLength;

  return `${days} д., ${hours} ч., ${minutes} м., ${seconds} с., ${milliseconds} мс.`;
}

export default router;