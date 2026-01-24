import { Request } from "../models/Request.js";
export const createReq = async (req, res) => {
    try {
        const { workspace_id } = req.params;
        const { folder_name, url, headers, method, body, user_id } = req.body;
        console.log('DEBUG createReq received user_id:', user_id);
        if (!folder_name || !headers || !url || !method || !body || !workspace_id || !user_id) {
            return res.status(400).json({ message: "complete all the fields, including user_id." });
        }
        // Convert user_id to ObjectId if it's a string
        const mongoose = (await import('mongoose')).default;
        let userIdObj = user_id;
        if (typeof user_id === 'string') {
            try {
                userIdObj = new mongoose.Types.ObjectId(user_id);
            } catch (e) {
                return res.status(400).json({ message: "Invalid user_id format." });
            }
        }
        const created = await Request.create({
            workspace_id,
            folder_name,
            url,
            headers,
            method,
            body,
            user_id: userIdObj
        });
        console.log('DEBUG created Request:', created);
        return res.status(200).json({
            success: true,
            created
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const getReq = async (req, res) => {
    try {
        const workspace_id = req.params;
        if (!workspace_id) {
            return res.status(400).json({ message: "complete all the fields." });
        }
        const getReq = await Request.find({
            workspace_id
        });
        return res.status(200).json({
            success: true,
            getReq
        });
    } catch (err) {
        return res.json(500).json({
            success: false
        });
    }
};

// Get request history with executions for a user
export const getRequestHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const Execution = (await import("../models/Execution.js")).default;

        // Get all executions for this user, sorted by most recent
        const executions = await Execution.find({ user_id: userId })
            .populate('request_id')
            .sort({ createdAt: -1 })
            .limit(50);

        // Format the response
        const history = executions.map(exec => ({
            id: exec._id,
            method: exec.request_id?.method || 'GET',
            url: exec.request_id?.url || 'Unknown',
            status: exec.status_code || 0,
            time: `${exec.latency_ms || 0}ms`,
            timestamp: exec.createdAt,
            state: exec.state,
            requestId: exec.request_id?._id
        }));

        return res.status(200).json({
            success: true,
            history
        });
    } catch (err) {
        console.error('Error fetching request history:', err);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
};