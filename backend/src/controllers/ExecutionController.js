import Execution from "../models/Execution.js"
import axios from "axios"
import {Request} from "../models/Request.js"

export const Executions=async(req,res)=>{
    let execution;
    try {
        const {requestId}=req.params;
        if(!requestId) return res.status(400).json({success:"false",message:"requestId required"})
        const executeReq = await Request.findById(requestId);
        if(!executeReq) return res.status(400).json({success:"false",message:"request not found"});

        // Debug: log the executeReq and user_id
        console.log('DEBUG executeReq:', executeReq);
        const reqObj = executeReq.toObject ? executeReq.toObject() : executeReq;
        let user_id = reqObj.user_id;
        console.log('DEBUG executeReq.user_id:', user_id);
        if (!user_id) {
            user_id = req.body.user_id || req.query.user_id || req.headers['x-user-id'];
            console.log('DEBUG fallback user_id:', user_id);
        }
        if (!user_id) {
            return res.status(400).json({success: false, message: "user_id is required in the request or Request document."});
        }
        const mongoose = (await import('mongoose')).default;
        if (typeof user_id === 'string') {
            try {
                user_id = new mongoose.Types.ObjectId(user_id);
            } catch (e) {
                return res.status(400).json({success: false, message: "Invalid user_id format."});
            }
        }
        console.log('DEBUG final user_id:', user_id);

        let safeHeaders = {};
        if (executeReq.headers && typeof executeReq.headers === 'object') {
            for (const [key, value] of Object.entries(executeReq.headers)) {
                if (
                    typeof key === 'string' &&
                    /^[A-Za-z0-9-]+$/.test(key) &&
                    value !== undefined &&
                    value !== null &&
                    !key.startsWith('$') &&
                    !key.startsWith('__')
                ) {
                    safeHeaders[key] = String(value);
                }
            }
        }

        const axiosconfig = {
            method: executeReq.method,
            url: executeReq.url,
            headers: safeHeaders,
            data: executeReq.body || {},
            validateStatus: () => true,
        };
        // Create execution with RUNNING state
        execution = await Execution.create({
            user_id: user_id,
            request_id: executeReq._id,
            status_code: null,
            response_body: null,
            latency_ms: null,
            state: "RUNNING"
        });
        console.log('Execution state set to RUNNING:', execution._id);
        const starttime = Date.now();
        let response;
        try {
            response = await axios(axiosconfig);
            const endtime = Date.now();
            const latency = endtime - starttime;
            execution.status_code = response.status;
            execution.response_body = response.data;
            execution.latency_ms = latency;
            execution.state = "SUCCESS";
            await execution.save();
            console.log("Saved execution:", execution.toObject());
            return res.status(200).json({
                success: true,
                executionId: execution._id,

                execution,
                response: {
                    status: response.status,
                    headers: response.headers,
                    body: response.data,
                    latency,
                },
            });
        } catch (error) {
            execution.state = "FAILED";
            await execution.save();
            console.log("Saved execution:", execution.toObject());
            return res.status(500).json({
                success: false,
                message: "execution failed",
                error: error.message,
                execution
            });
        }
    } catch (error) {
        if (execution) {
            execution.state = "FAILED";
            await execution.save();
            console.log("Saved execution:", execution.toObject());
        }
        res.status(500).json({
            success:"false",
            message:"execution failed",
            error: error.message
        });
    }
}

// Get a single execution by ID
export const getExecutionById = async (req, res) => {
    try {
        const { executionId } = req.params;
        
        if (!executionId) {
            return res.status(400).json({
                success: false,
                message: "executionId is required"
            });
        }

        const execution = await Execution.findById(executionId);
        
        if (!execution) {
            return res.status(404).json({
                success: false,
                message: "Execution not found"
            });
        }

        return res.status(200).json({
            success: true,
            execution: execution
        });
    } catch (error) {
        console.error("Error fetching execution:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch execution",
            error: error.message
        });
    }
}
