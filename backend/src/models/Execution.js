import mongoose from 'mongoose'
const executionSchema = new mongoose.Schema(
  {
    request_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      required: true,
      index: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    response_body: {
      type: mongoose.Schema.Types.Mixed
    },
    status_code: {
      type: Number
    },
    latency_ms: {
      type: Number
    }
  },
  { timestamps: true }
);

const Execution = mongoose.model("Execution", executionSchema);
export default Execution;
