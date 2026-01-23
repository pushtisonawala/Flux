import Execution from "../models/Execution.js"
import axios from "axios"
import {Request} from "../models/Request.js"

export const Executions=async(req,res)=>{
try{
    const {requestId}=req.params;
    if(!requestId) return res.status(400).json({success:"false",message:"requestId required"})
    const executeReq = await Request.findById(requestId);
    if(!executeReq) return res.status(400).json({success:"false",message:"request not found"});

    // Debug: log the executeReq and user_id
    console.log('DEBUG executeReq:', executeReq);
    // Convert to plain object to reliably access user_id
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
    // Convert user_id to ObjectId if it's a string
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
    const starttime = Date.now();
    const response = await axios(axiosconfig);
    const endtime = Date.now();
    const latency = endtime - starttime;
    const execution = await Execution.create({
        user_id: user_id,
        request_id: executeReq._id,
        status_code: response.status,
        response_body: response.data,
        latency_ms: latency
    });
    return res.status(200).json({
        success: true,
        execution,
        response: {
            status: response.status,
            headers: response.headers,
            body: response.data,
            latency,
        },
    });
}catch(error){
    res.status(500).json({
        success:"false",
        message:"execution failed",
        error: error.message
    })
}
}