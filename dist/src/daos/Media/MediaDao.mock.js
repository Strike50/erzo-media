"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _shared_1 = require("@shared");
const MockDao_mock_1 = require("../MockDb/MockDao.mock");
class MediaDao extends MockDao_mock_1.MockDaoMock {
    getAll() {
        const _super = name => super[name];
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const db = yield _super("openDb").call(this);
                return db.media;
            }
            catch (err) {
                throw err;
            }
        });
    }
    add(media) {
        const _super = name => super[name];
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const db = yield _super("openDb").call(this);
                media.id = _shared_1.getRandomInt();
                db.medias.push(media);
                yield _super("saveDb").call(this, db);
            }
            catch (err) {
                throw err;
            }
        });
    }
    update(media) {
        const _super = name => super[name];
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const db = yield _super("openDb").call(this);
                for (let i = 0; i < db.medias.length; i++) {
                    if (db.medias[i].id === media.id) {
                        db.medias[i] = media;
                        yield _super("saveDb").call(this, db);
                        return;
                    }
                }
                throw new Error('Media not found');
            }
            catch (err) {
                throw err;
            }
        });
    }
    delete(id) {
        const _super = name => super[name];
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const db = yield _super("openDb").call(this);
                for (let i = 0; i < db.media.length; i++) {
                    if (db.media[i].id === id) {
                        db.medias.splice(i, 1);
                        yield _super("saveDb").call(this, db);
                        return;
                    }
                }
                throw new Error('Media not found');
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.MediaDao = MediaDao;
//# sourceMappingURL=MediaDao.mock.js.map