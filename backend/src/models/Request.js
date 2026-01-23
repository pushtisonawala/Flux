import mongoose from 'mongoose'
const requestSchema = new mongoose.Schema(
  {
    workspace_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    folder_name: {
      type: String
    },
    method: {
      type: String,
      enum: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    headers: {
      type: Map,
      of: String,
      default: {}
    },
    body: {
      type: mongoose.Schema.Types.Mixed
    },
    last_run_status: {
      type: Number
    }
  },
  { timestamps: true }
);

export const Request = mongoose.model("Request", requestSchema);
