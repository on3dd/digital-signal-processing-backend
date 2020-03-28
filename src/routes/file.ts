import {Request, Response, Router} from 'express';
import {BAD_REQUEST, OK, INTERNAL_SERVER_ERROR} from 'http-status-codes';
import {ParamsDictionary} from 'express-serve-static-core';
import {paramMissingError} from '@shared/constants';
import * as fs from 'fs';

// Init shared
const router = Router();

function processFile(buffer: Buffer) {
  return new Promise((resolve, reject) => {
    const lines = buffer.toString().split(/\r?\n/);

    // print all lines
    lines.forEach((line) => {
      console.log(line);
    });

    resolve();
  });
}

/* GET users listing. */
router.post('/', function (req, res, next) {
  if (req.files === undefined) {
    res.status(BAD_REQUEST).send('Request should contain files field \n');
    return;
  }

  fs.promises.readFile(req.files.file.path)
      .then(async (buffer) => {
        await processFile(buffer);
        res.status(OK).send('OK \n');
      })
      .catch((err) => {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).send(err);
      });
});

export default router;