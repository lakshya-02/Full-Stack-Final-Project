import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved"],
      default: "Open",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attachment: {
      originalName: {
        type: String,
        trim: true,
      },
      filename: {
        type: String,
        trim: true,
      },
      mimetype: {
        type: String,
        trim: true,
      },
      size: {
        type: Number,
      },
      url: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Ticket = mongoose.model("Ticket", ticketSchema);
