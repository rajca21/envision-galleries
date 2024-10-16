import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    exhibit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exhibit',
      required: true,
    },
    qrCode: String,
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Ticket = mongoose.model('Ticket', TicketSchema);
