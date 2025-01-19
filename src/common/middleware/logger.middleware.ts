import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Extracting user ID from the bearer token
    const authorizationHeader = req.headers['authorization'];
    let userId = null;    

    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      const token = authorizationHeader.substring('Bearer '.length);

      // Assuming the user ID is stored in the token's payload as 'sub'
      const tokenPayload = jwt.decode(token);
      userId = tokenPayload ? tokenPayload['sub'] : null;
    }

    // Getting the request log
    console.log(`req:`, {
      timeStamp: new Date().toISOString(),
      user: userId,
      ip: req.ip,
      method: req.method,
      originalUrl: req.originalUrl,
      body: req.body,
    });

    // Getting the response log
    getResponseLog(res);

    if (next) {
      next();
    }
  }
}

const getResponseLog = (res: Response) => {
  const rawResponse = res.write;
  const rawResponseEnd = res.end;

  let chunkBuffers = [];

  // New chunk passed in as Buffer each time write() is called by stream
  // Take chunks as a rest parameter since it is an array. This allows applying Array methods directly
  console.log(`======>> Beginning res.write`);
  res.write = (...chunks) => {
    // Not able to console.log in res.write: It is a writable stream
    const resArgs = [];
    for (let i = 0; i < chunks.length; i++) {
      // undefined values would break Buffer.concat(resArgs)
      if (chunks[i]) resArgs[i] = Buffer.from(chunks[i]);

      // This handling comes in when buffer is full, hence rawResponse === false after rawResponse.apply() below
      if (!chunks[i]) {
        res.once('drain', res.write);

        // Resume from last falsy iteration
        --i;
      }
    }

    // Join together all collected Buffers in 1 array
    if (Buffer.concat(resArgs)?.length) {
      chunkBuffers = [...chunkBuffers, ...resArgs];
    }

    return rawResponse.apply(res, resArgs);
  };

  console.log(`========> Done writing, beginning res.end`);
  res.end = (...chunks) => {
    const resArgs = [];
    for (let i = 0; i < chunks.length; i++) {
      if (chunks[i]) resArgs[i] = Buffer.from(chunks[i]);
    }

    // Join together all collected Buffers then encode as utf8 string
    const responseBody = Buffer.concat(resArgs).toString('utf8');

    const responseLog = {
      response: {
        timeStamp: new Date().toISOString(),
        statusCode: res.statusCode,
        body: responseBody,
      },
    };

    if (res.statusCode >= 200 && res.statusCode < 300) {
      // Log as console.log for successful responses
      console.log('res.success: ', responseLog);
    } else {
      // Log as console.error for error responses
      console.error('res.error: ', responseLog);
    }

    rawResponseEnd.apply(res, resArgs);
    return responseLog as unknown as Response;
  };
};
