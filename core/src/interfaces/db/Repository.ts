import { Model } from '../models/Model';
import { Pagination } from '../Pagination';

export interface Repository<S extends Model> {
  all(projection?: object): Promise<object>;

  allWithDeleted(projection?: object): Promise<object>;

  select(options?: object, projection?: object): Promise<object>;

  find(options: object, projection?: object): Promise<S[]>;

  paginate(
    page?: number,
    conditions?: object,
    limit?: number
  ): Promise<Pagination<S>>;

  findOne(options: object, projection?: object): Promise<S | null>;

  take(limit: number): Promise<S[]>;

  findOneDeleted(options: object, projection?: object): Promise<S | null>;

  findById(entityId: string, projection?: object): Promise<S | null>;

  findByIdAndUpdate(
    entityIds: string[],
    update: Partial<S>,
    options?: object
  ): Promise<S | null>;

  count(cond?: object): Promise<number>;

  countWithDeleted(cond?: object): Promise<number>;

  create(entity: Partial<S>): Promise<S>;

  createMany(entities: S[]): Promise<S[]>;

  update(entityId: string, entity: Partial<S>): Promise<S | null>;

  delete(entityId: string): Promise<void>;

  deleteMany(ids: string[]): Promise<void>;
}
