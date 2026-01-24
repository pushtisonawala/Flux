import Execution from "../models/Execution.js"

export const getExecutionHistory = async (req, res) => {
  try {
    const { requestId } = req.params

    const executions = await Execution.find({ request_id: requestId })
      .sort({ createdAt: -1 }) // newest first
      .select("state status_code latency_ms createdAt")

    return res.status(200).json({
      success: true,
      executions
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch execution history"
    })
  }
}
