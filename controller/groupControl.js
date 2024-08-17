const Group = require("../models/groupSchema")
const Post = require("../models/postSchema")


exports.createGroup = async (req, res) => {
    try {
        const { name, description } = req.body;
        if(!name) return res.status(400).json({msg: "Name is required"})
        const group = new Group({
          name,
          description,
          admins: [req.id],
          members: [req.id],
        });
        const savedGroup = await group.save();
        res.status(201).json({msg: "group created"});
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}