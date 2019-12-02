import { UserDao } from '@daos';
import { logger } from '@shared';
import { Request, Response, Router, Express } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { paramMissingError } from '@shared';
import { ParamsDictionary } from 'express-serve-static-core';
import AWS, {AWSError} from 'aws-sdk';
import S3, {GetObjectRequest} from 'aws-sdk/clients/s3';
import {GetObjectResponse} from 'aws-sdk/clients/mediastoredata';

// Init shared
const router = Router();

const FOLDER = 'videos';
const BUCKET = process.env.SCALEWAY_BUCKET;
const AWS_ENDPOINT = new AWS.Endpoint('https://s3.'.concat(process.env.SCALEWAY_REGION || '').concat('.scw.cloud'));

const getS3Bucket = (): any => {
  return new S3(
    {
      accessKeyId: process.env.SCALEWAY_ACCESS_KEY_ID,
      secretAccessKey: process.env.SCALEWAY_SECRET_ACCESS_TOKEN,
      region: process.env.SCALEWAY_REGION,
    });
};
/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
