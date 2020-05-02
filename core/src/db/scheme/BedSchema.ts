import { Document, Model, model, Schema } from 'mongoose';
import { Bed } from '../../interfaces/models/Bed';

const schema: Schema = new Schema(
  {
    hasEcmo: {
      type: Boolean,
      default: false,
    },
    hospital: {
      type: Schema.Types.ObjectId,
      ref: 'Hospital',
    },
    isAvailable: {
      type: Boolean,
      default: false,
    },
    isHighCare: {
      type: Boolean,
      default: false,
    },
    isReserved: {
      type: Boolean,
      default: false,
    },
    position: {
      floor: {
        type: String,
      },
      location: {
        type: String,
      },
      room: {
        type: String,
      },
      station: {
        type: String,
        required: true,
      },
    },
    reservedUntil: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const bedSchema: Model<Bed & Document> = model<Bed & Document>(
  'Bed',
  schema
);
