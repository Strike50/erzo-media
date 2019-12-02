
import { MediaDao} from '../daos/Media/MediaDao';
import { logger } from '@shared';
import { Request, Response, Router, Express } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { paramMissingError } from '@shared';
import { ParamsDictionary } from 'express-serve-static-core';

// Init shared
const router = Router();
const mediaDao = new MediaDao();

/******************************************************************************
 *                      Get All Medias - "GET /api/medias/all"
 ******************************************************************************/

router.get('/all', async (req: Request, res: Response) => {
  try {
    const medias = await mediaDao.getAll();
    return res.status(OK).json({medias});
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message,
    });
  }
});

/******************************************************************************
 *                       Add One - "POST /api/medias/add"
 ******************************************************************************/

router.post('/add', async (req: Request, res: Response) => {
  try {
    const { media } = req.body;
    if (!media) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError,
      });
    }
    await mediaDao.add(media);
    return res.status(CREATED).end();
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message,
    });
  }
});

/******************************************************************************
 *                       Update - "PUT /api/medias/update"
 ******************************************************************************/

router.put('/update', async (req: Request, res: Response) => {
  try {
    const { media } = req.body;
    if (!media) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError,
      });
    }
    media.id = Number(media.id);
    await mediaDao.update(media);
    return res.status(OK).end();
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message,
    });
  }
});

/******************************************************************************
 *                    Delete - "DELETE /api/media/delete/:id"
 ******************************************************************************/

router.delete('/delete/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params as ParamsDictionary;
    await mediaDao.delete(Number(id));
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
