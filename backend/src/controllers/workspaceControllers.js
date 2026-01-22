import { Workspace } from "../models/Workspace.js";
export const createWorkspace = async (req, res) => {
    try {
        const { name, ownerId } = req.body;
        if (!name || !ownerId) {
            return res.status(400).json({ success: false, message: "name and ownerId are required" });
        }
        const workspace = await Workspace.create({ name, owner_id: ownerId });
        return res.json({
            success: true,
            workspace: {
                _id: workspace._id,
                name: workspace.name,
                ownerId: workspace.owner_id
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


