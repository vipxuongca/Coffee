import userDetail from "../models/user-detail-model.js";

// Create a new shipping detail
export const addDetail = async (req, res) => {
  try {
    const newDetail = new ShippingDetail(req.body);
    await newDetail.save();
    res.status(201).json(newDetail);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all shipping details for a user
export const getAllDetails = async (req, res) => {
  try {
    const details = await ShippingDetail.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(details);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get the default shipping detail
export const getDefaultDetail = async (req, res) => {
  try {
    const detail = await ShippingDetail.findOne({ userId: req.params.userId, isDefault: true });
    res.status(200).json(detail || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update shipping detail
export const updateDetail = async (req, res) => {
  try {
    const updated = await ShippingDetail.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete shipping detail
export const deleteDetail = async (req, res) => {
  try {
    await ShippingDetail.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Set one as default (unset others)
export const setDefaultDetail = async (req, res) => {
  try {
    const detail = await ShippingDetail.findById(req.params.id);
    if (!detail) return res.status(404).json({ error: "Shipping detail not found" });

    await ShippingDetail.updateMany(
      { userId: detail.userId },
      { $set: { isDefault: false } }
    );

    detail.isDefault = true;
    await detail.save();

    res.status(200).json(detail);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
