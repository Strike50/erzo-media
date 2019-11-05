import { IMedia } from '../../entities/Media';

export interface IMediaDao {
  getAll: () => Promise<IMedia[]>;
  add: (media: IMedia) => Promise<void>;
  update: (media: IMedia) => Promise<void>;
  delete: (id: number) => Promise<void>;
}

export class MediaDao implements IMediaDao {

  /**
   *
   */
  public async getAll(): Promise<IMedia[]> {
    // TODO
    return [] as any;
  }

  /**
   *
   * @param media
   */
  public async add(media: IMedia): Promise<void> {
    // TODO
    return {} as any;
  }

  /**
   *
   * @param media
   */
  public async update(media: IMedia): Promise<void> {
    // TODO
    return {} as any;
  }

  /**
   *
   * @param id
   */
  public async delete(id: number): Promise<void> {
    // TODO
    return {} as any;
  }
}
