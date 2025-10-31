import userDetail from "../models/user-detail-model.js";


// Create a new shipping detail
export const addDetail = async (req, res) => {
  try {
    const {
      receiverName,
      phone,
      addressLine1,
      ward,
      city,
      isDefault } = req.body;

    // Check if userDetail already exists for this user
    let userDetails = await userDetail.findOne({ userId: req.user.id });

    if (!userDetails) {
      userDetails = new userDetail({
        userId: req.user.id,
        item: [{
          receiverName,
          phone,
          addressLine1,
          ward,
          city,
          isDefault,
        }],
      });
    } else {
      if (isDefault) {
        userDetails.item.forEach(entry => {
          entry.isDefault = false;
        });
      }

      userDetails.item.push({
        receiverName,
        phone,
        addressLine1,
        ward,
        city,
        isDefault,
      });
    }
    await userDetails.save();

    res.status(201).json({
      success: true,
      data: userDetails.toObject(),
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all shipping details for a user
export const getAllDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    const detail = await userDetail.findOne({ userId });
    if (!detail) {
      return res.status(404).json({ error: "Không tìm thấy địa chỉ" });
    }

    // Sort the items by creation time (most recent first)
    const sortedItems = detail.item.sort(
      (a, b) => b.createdAt - a.createdAt
    );

    res.status(200).json({
      success: true,
      data: sortedItems,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get the default shipping detail
export const getDefaultDetail = async (req, res) => {
  try {
    const detail = await userDetail.aggregate([
      { $match: { userId: req.user.id } },
      { $unwind: "$item" },
      { $match: { "item.isDefault": true } },
      { $project: { _id: 0, item: 1 } },
    ]);

    res.status(200).json(detail[0]?.item || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Update shipping detail
export const updateDetail = async (req, res) => {
  try {
    const updated = await userDetail.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete shipping detail
export const deleteDetail = async (req, res) => {
  try {
    const userId = req.user.id;
    const itemId = req.params.id;

    const updated = await userDetail.findOneAndUpdate(
      { userId },
      { $pull: { item: { _id: itemId } } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "User or item not found" });
    }

    res.status(200).json({
      success: true,
      data: updated.toObject(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Set one as default (unset others)
export const setDefaultDetail = async (req, res) => {
  try {
    const userId = req.user.id;
    const itemId = req.params.id;

    // First, unset all defaults
    await userDetail.updateOne(
      { userId },
      { $set: { "item.$[].isDefault": false } }
    );

    // Then, set the chosen item as default
    const updated = await userDetail.findOneAndUpdate(
      { userId, "item._id": itemId },
      { $set: { "item.$.isDefault": true } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json({
      success: true,
      data: updated.toObject(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

