import userModel from '../../models/user-model.js';

const singleUser = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await userModel.findOne({ _id: userId }).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Tài khoản không tồn tại',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Sucessfully extract information',
      data: user,
    });

  } catch (error) {
    console.error('Lỗi:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

export { singleUser };