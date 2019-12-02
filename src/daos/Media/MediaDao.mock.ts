import { IMedia} from '../../entities/Media';
import { getRandomInt } from '@shared';
import { MockDaoMock } from '../MockDb/MockDao.mock';
import { IMediaDao } from './MediaDao';

export class MediaDao extends MockDaoMock implements IMediaDao {

  public async getAll(): Promise<IMedia[]> {
    try {
      const db = await super.openDb();
      return db.media;
    } catch (err) {
      throw err;
    }
  }

  public async add(media: IMedia): Promise<void> {
    try {
      const db = await super.openDb();
      media.id = getRandomInt();
      db.medias.push(media);
      await super.saveDb(db);
    } catch (err) {
      throw err;
    }
  }

  public async update(media: IMedia): Promise<void> {
    try {
      const db = await super.openDb();
      for (let i = 0; i < db.medias.length; i++) {
        if (db.medias[i].id === media.id) {
          db.medias[i] = media;
          await super.saveDb(db);
          return;
        }
      }
      throw new Error('Media not found');
    } catch (err) {
      throw err;
    }
  }

  public async delete(id: number): Promise<void> {
    try {
      const db = await super.openDb();
      for (let i = 0; i < db.media.length; i++) {
        if (db.media[i].id === id) {
          db.medias.splice(i, 1);
          await super.saveDb(db);
          return;
        }
      }
      throw new Error('Media not found');
    } catch (err) {
      throw err;
    }
  }
}
