import { Request, Response, Router } from 'express';
import { BAD_REQUEST, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';
import { paramMissingError } from '@shared/constants';
import * as fs from 'fs';

// Init shared
const router = Router();

function processFile(buffer: Buffer) {
  // split the contents by new line
  const lines = buffer.toString().split(/\r?\n/);

  // print all lines
  lines.forEach((line) => {
    console.log(line);
  });
}

/* GET users listing. */
router.post('/', function(req, res, next) {
  if (req.files === undefined) {
    res.status(400).send('Request should contain files field \n');
    return;
  }

  fs.promises.readFile(req.files.file.path)
      .then((buffer) => {
        processFile(buffer);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(err);
      });
});

export default router;