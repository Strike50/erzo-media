import { logger } from '@shared';
import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { paramMissingError } from '@shared';
import { ParamsDictionary } from 'express-serve-static-core';
import S3 from 'aws-sdk/clients/s3';
import {uuid} from 'uuidv4';
import multer from 'multer';
import pkgcloud from 'pkgcloud';

const upload = multer({
    dest: 'upload/',
    storage: multer.memoryStorage(),
});

// Init shared
const router = Router();

const FOLDER = 'images';
const BUCKET = process.env.SCALEWAY_BUCKET;

const getS3Bucket = (): any => {
    return new S3(
      {
          accessKeyId: process.env.SCALEWAY_ACCESS_KEY_ID,
          secretAccessKey: process.env.SCALEWAY_SECRET_ACCESS_TOKEN,
      });
};
/******************************************************************************
 *                      Get All Users - "GET /api/users/all"
 ******************************************************************************/

router.get('/all', async (req: Request, res: Response) => {

    // const getPromise = new AWS.S3({
    //     apiVersion: '2006-03-01',
    //     endpoint: AWS_ENDPOINT,
    // })
    //   .getObject()
    //   .promise();
    // getPromise.then((data) => {
    //     logger.info(data);
    // });

    // try {
    //     const users = await userDao.getAll();
    //     return res.status(OK).json({users});
    // } catch (err) {
    //     logger.error(err.message, err);
    //     return res.status(BAD_REQUEST).json({
    //         error: err.message,
    //     });
    // }
});

/******************************************************************************
 *                       Add One - "POST /api/users/add"
 ******************************************************************************/

router.post('', upload.single('imagePosted'), async (req: Request, res: Response) => {
    const filename = uuid();
    const client = pkgcloud.storage.createClient({
        provider: 'amazon',
        keyId: process.env.SCALEWAY_ACCESS_KEY_ID,
        key: process.env.SCALEWAY_SECRET_ACCESS_TOKEN,
        // @ts-ignore
        endpoint: process.env.SCALEWAY_ENDPOINT,
    });
    const readStream = require('streamifier').createReadStream(req.file.buffer);
    const writeStream = client.upload({
        container: (BUCKET || '').concat('/').concat(FOLDER),
        remote: filename,
    });
    writeStream.on('error', (err) => {
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    });

    writeStream.on('success', (file) => {
        return res.status(CREATED).json({
            contentId: filename,
        });
        // success, file will be a File model
    });

    readStream.pipe(writeStream);
});

/******************************************************************************
 *                       Update - "PUT /api/users/update"
 ******************************************************************************/

router.put('/update', async (req: Request, res: Response) => {
    try {
        const { user } = req.body;
        if (!user) {
            return res.status(BAD_REQUEST).json({
                error: paramMissingError,
            });
        }
        user.id = Number(user.id);
        return res.status(OK).end();
    } catch (err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

/******************************************************************************
 *                    Delete - "DELETE /api/users/delete/:id"
 ******************************************************************************/

router.delete('/delete/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params as ParamsDictionary;
        return res.status(OK).end();
    } catch (err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
