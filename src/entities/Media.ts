export interface IMedia {
  id?: number;
  type?: boolean;
}

export class Media implements IMedia {

  public id?: number;
  public type?: boolean;

  constructor(id: number, type: boolean) {
    this.id = id;
    this.type = type;
  }
}
