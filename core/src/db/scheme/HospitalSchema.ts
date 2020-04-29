import { Document, model, Model, Schema } from 'mongoose';
import { Hospital } from '../../interfaces/models/Hospital';

const schema: Schema = new Schema(
  {
    address: {
      city: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        // 3166-1 alpha-2
        default: 'DE',
      },
      postalCode: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        default: '',
      },
      street: {
        type: String,
        required: true,
      },
      location: {
        type: {
          type: String,
          enum: ['Point'],
          required: true,
        },
        coordinates: {
          type: [Number],
          required: true,
        },
      },
    },
    contact: {
      web: {
        type: String,
      },
      phoneNumbers: [
        {
          type: String,
        },
      ],
    },
    description: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
schema.index({ 'address.location': '2dsphere' });
export const hospitalSchema: Model<Hospital & Document> = model<
  Hospital & Document
>('Hospital', schema);
