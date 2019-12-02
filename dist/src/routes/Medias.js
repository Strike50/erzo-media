"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const MediaDao_1 = require("../daos/Media/MediaDao");
const _shared_1 = require("@shared");
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const _shared_2 = require("@shared");
const router = express_1.Router();
const mediaDao = new MediaDao_1.MediaDao();
router.get('/all', (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    try {
        const medias = yield mediaDao.getAll();
        return res.status(http_status_codes_1.OK).json({ medias });
    }
    catch (err) {
        _shared_1.logger.error(err.message, err);
        return res.status(http_status_codes_1.BAD_REQUEST).json({
            error: err.message,
        });
    }
}));
router.post('/add', (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    try {
        const { media } = req.body;
        if (!media) {
            return res.status(http_status_codes_1.BAD_REQUEST).json({
                error: _shared_2.paramMissingError,
            });
        }
        yield mediaDao.add(media);
        return res.status(http_status_codes_1.CREATED).end();
    }
    catch (err) {
        _shared_1.logger.error(err.message, err);
        return res.status(http_status_codes_1.BAD_REQUEST).json({
            error: err.message,
        });
    }
}));
router.put('/update', (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    try {
        const { media } = req.body;
        if (!media) {
            return res.status(http_status_codes_1.BAD_REQUEST).json({
                error: _shared_2.paramMissingError,
            });
        }
        media.id = Number(media.id);
        yield mediaDao.update(media);
        return res.status(http_status_codes_1.OK).end();
    }
    catch (err) {
        _shared_1.logger.error(err.message, err);
        return res.status(http_status_codes_1.BAD_REQUEST).json({
            error: err.message,
        });
    }
}));
router.delete('/delete/:id', (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield mediaDao.delete(Number(id));
        return res.status(http_status_codes_1.OK).end();
    }
    catch (err) {
        _shared_1.logger.error(err.message, err);
        return res.status(http_status_codes_1.BAD_REQUEST).json({
            error: err.message,
        });
    }
}));
exports.default = router;
//# sourceMappingURL=Medias.js.map