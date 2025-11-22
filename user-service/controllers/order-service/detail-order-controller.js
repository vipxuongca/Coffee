import detailModel from "../../models/detail-model.js";

// Get the default shipping detail
export const getDefaultAddressDetail = async (req, res) => {
  const userId = req.body.userId;
  try {
    const detail = await detailModel.aggregate([
      { $match: { userId:  userId} },
      { $unwind: "$item" },
      { $match: { "item.isDefault": true } },
      { $project: { _id: 0, item: 1 } },
    ]);

    res.status(200).json(detail[0]?.item || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};