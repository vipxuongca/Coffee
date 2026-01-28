import reportModel from '../models/report-model.js';

const getReport = async (req, res) => {
  try {
    const reports = await reportModel.find();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports', error });
  }
};

export { getReport };