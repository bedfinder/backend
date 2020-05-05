import mongoose from 'mongoose';
import { Model } from '../../interfaces/models/Model';
import { Pagination } from '../../interfaces/Pagination';
import { Repository } from '../../interfaces/db/Repository';

export abstract class MongooseRepository<S extends Model & mongoose.Document>
  implements Repository<S> {
  protected model: mongoose.Model<S>;

  protected guarded: Partial<S> = {};

  constructor(schemaModel: mongoose.Model<S>) {
    this.model = schemaModel;
  }

  async create(item: S): Promise<S> {
    return this.model.create(item);
  }

  async createMany(items: S[]): Promise<S[]> {
    return this.model.create(items);
  }

  async all(projection?: object): Promise<S[]> {
    return (
      this.model
        // @ts-ignore
        .find({ deletedAt: null }, projection || this.guarded)
        .lean()
        .exec()
    );
  }

  async paginate(
    page = 1,
    conditions: object = {},
    limit = 10,
    projection?: object
  ): Promise<Pagination<S>> {
    const skip: number = (page - 1) * limit;

    return {
      total: await this.model
        // @ts-ignore
        .find({ deletedAt: null, ...conditions }, this.guarded)
        .countDocuments()
        .exec(),
      // @ts-ignore
      data: await this.model
        // @ts-ignore
        .find({ deletedAt: null, ...conditions }, projection || this.guarded)
        .limit(limit)
        .skip(skip)
        .exec(),
    };
  }

  async allWithDeleted(projection?: object): Promise<object> {
    return this.model
      .find({}, projection || this.guarded)
      .lean()
      .exec();
  }

  async select(options?: object, projection?: object): Promise<object> {
    return (
      this.model
        // @ts-ignore
        .find({ deletedAt: null, ...options } || {}, projection || this.guarded)
        .lean()
        .exec()
    );
  }

  async find(options: object, projection?: object): Promise<S[]> {
    return (
      this.model
        // @ts-ignore
        .find({ deletedAt: null, ...options }, projection || this.guarded)
        .exec()
    );
  }

  async findOne(options: object, projection?: object): Promise<S> {
    return (
      this.model
        // @ts-ignore
        .findOne({ deletedAt: null, ...options }, projection || this.guarded)
        .exec()
    );
  }

  async findOneDeleted(
    options: object,
    projection?: object
  ): Promise<S | null> {
    return this.model.findOne(options, projection || this.guarded).exec();
  }

  async update(entityId: string, entity: Partial<S>): Promise<S | null> {
    return (
      this.model
        // @ts-ignore
        .findOneAndUpdate({ _id: entityId }, entity, { new: true })
        .exec()
    );
  }

  async delete(entityId: string): Promise<void> {
    // @ts-ignore
    await this.model.deleteOne({ _id: entityId }).exec();
  }

  async deleteMany(ids: string[]): Promise<void> {
    // @ts-ignore
    await this.model.deleteMany({ _id: { $in: ids } }).exec();
  }

  async findById(entityId: string, projection?: object): Promise<S | null> {
    return this.model.findById(entityId, projection || this.guarded).exec();
  }

  async findByIdAndUpdate(
    entityIds: string[],
    update: object,
    options?: object
  ): Promise<S | null> {
    return this.model
      .findByIdAndUpdate(entityIds, update, options || { new: true })
      .exec();
  }

  async count(cond?: object): Promise<number> {
    // @ts-ignore
    return this.model.count({ deletedAt: null, ...cond } || {}).exec();
  }

  async countWithDeleted(cond?: object): Promise<number> {
    return this.model.count(cond || {}).exec();
  }

  async take(limit = 10): Promise<S[]> {
    return this.model
      .find({})
      .limit(limit)
      .exec();
  }
}
