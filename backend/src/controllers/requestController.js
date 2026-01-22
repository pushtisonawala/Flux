import { Request } from "../models/Request.js";
export const createReq = async (req, res) => {
    try {
        const { workspace_id } = req.params;
        const { folder_name, url, headers, method, body } = req.body;
        if (!folder_name || !headers || !url || !method || !body || !workspace_id) {
            return res.status(400).json({ message: "complete all the fields." });
        }
        const created = await Request.create({
            workspace_id,
            folder_name,
            url,
            headers,
            method,
            body
        });
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