import { logger } from '@shared';
import { Request, Response, Router } from 'express';
import {BAD_REQUEST, CREATED, NO_CONTENT, OK} from 'http-status-codes';
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

router.get('/:id', async (req: Request, res: Response) => {
    const {id} = req.params as ParamsDictionary;
    const readStream = CLIENT.download({
        container: CONTAINER,
        remote: id,
    });
    readStream.on('error', (err) => {
        res.status(BAD_REQUEST).json({
            error: err.message,
        }).send();
    });

    readStream.pipe(res);
});

/******************************************************************************
 *                       Add One Video - "POST /videos"
 ******************************************************************************/

router.post('', upload.single('file'), async (req: Request, res: Response) => {
    const nameArray = req.file.originalname.split('.');
    const extension = '.'.concat(nameArray[nameArray.length - 1]);
    const readStream = require('streamifier').createReadStream(req.file.buffer);
    const filename = uuid().concat(extension);
    const writeStream = CLIENT.upload({
        container: CONTAINER,
        remote: filename,
    });
    writeStream.on('error', (err) => {
        res.status(BAD_REQUEST).json({
            error: err.message,
        }).send();
    });

    writeStream.on('success', () => {
        res.status(CREATED).setHeader('Content-Location', filename);
        res.send();
    });
    readStream.pipe(writeStream);
});

/******************************************************************************
 *                    Delete One Video - "DELETE /videos/:id"
 ******************************************************************************/

router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params as ParamsDictionary;
    await CLIENT.removeFile(CONTAINER, id, (err) => {
        if (err) {
            res.status(BAD_REQUEST).json({
                error: err,
            }).send();
        }
        return res.status(NO_CONTENT).send();
    });
});

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
