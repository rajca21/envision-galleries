import mongoose from 'mongoose';

const ExhibitSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    description: String,
    artist: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    paintings: {
      type: Array,
      default: [],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
  },
  { timestamps: true }
);

export const Exhibit = mongoose.model('Exhibit', ExhibitSchema);
