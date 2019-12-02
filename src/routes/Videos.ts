import { logger } from '@shared';
import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';
import {uuid} from 'uuidv4';
import multer from 'multer';
import pkgcloud from 'pkgcloud';

const upload = multer({
    dest: 'upload/',
    storage: multer.memoryStorage(),
});

// Init shared
const router = Router();

const FOLDER = 'videos';
const BUCKET = process.env.SCALEWAY_BUCKET;
const CONTAINER = (BUCKET || '').concat('/').concat(FOLDER);

const CLIENT = pkgcloud.storage.createClient({
    provider: 'amazon',
    keyId: process.env.SCALEWAY_ACCESS_KEY_ID,
    key: process.env.SCALEWAY_SECRET_ACCESS_TOKEN,
    // @ts-ignore
    endpoint: process.env.SCALEWAY_ENDPOINT,
});

/******************************************************************************
 *                      Get One Video - "GET /videos/{:id}"
 ******************************************************************************/

router.get('/:fileId', async (req: Request, res: Response) => {
    const {fileId} = req.params as ParamsDictionary;
    const readStream = CLIENT.download({
        container: CONTAINER,
        remote: fileId,
    });
    readStream.on('error', (err) => {
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    });
    readStream.on('success', (file) => {
        // tslint:disable-next-line:no-console
        console.log(file);
        return res.status(OK).json({
            image: file,
        });
        // success, file will be a File model
    });
});

/******************************************************************************
 *                       Add One Video - "POST /videos"
 ******************************************************************************/

router.post('', upload.single('imagePosted'), async (req: Request, res: Response) => {
    const nameArray = req.file.originalname.split('.');
    const extension = '.'.concat(nameArray[nameArray.length - 1]);
    const readStream = require('streamifier').createReadStream(req.file.buffer);
    const filename = uuid().concat(extension);
    const writeStream = CLIENT.upload({
        container: CONTAINER,
        remote: filename,
    });
    writeStream.on('error', (err) => {
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    });

    writeStream.on('success', () => {
        return res.status(CREATED).json({
            contentId: filename,
        });
        // success, file will be a File model
    });
    readStream.pipe(writeStream);
});

/******************************************************************************
 *                    Delete One Video - "DELETE /videos/:id"
 ******************************************************************************/

router.delete('/:fileId', async (req: Request, res: Response) => {
    const { fileId } = req.params as ParamsDictionary;
    CLIENT.removeFile(CONTAINER, fileId, (err) => {
        return res.status(BAD_REQUEST).end();
    });
    return res.status(OK).end();
});

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
