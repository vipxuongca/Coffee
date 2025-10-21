import adminModel from '../models/admin-model.js';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
}

const loginAdmin = async (req, res) => {

  /* expected payload:
    {
      "email": "sample@gmail.com",
      "password": "Sample@1234"
    }  
  */
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill all the fields' });
    }
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Admin does not exist' });
    }

    const isMatch = await bycrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    } else {
      const token = createToken(admin._id);
      return res.status(200).json({ success: true, token });
    }
  }
  catch (error) {
    console.error('Error logging in admin:', error);
    res.status(500).json({ message: error.message });
  }
}

const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validation
    if ( !email || !password) {
      return res.status(400).json({ message: 'Please fill all the fields' });
    }

    const exists = await adminModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Admin already exists' });
    }

    // validation of email and strong pass
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Please enter a valid email' });
    } else if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ message: 'Password is not strong enough. It should be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and symbols.' });
    }

    // hash the password
    const salt = await bcrypt.genSalt(10); // 5 to 15, longer is more secure yet slower
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new adminModel({
      email,
      password: hashedPassword,
    });

    const admin = await newAdmin.save();
    console.log('Admin registered successfully:', admin);

    const token = createToken(admin._id);

    res.json({ success: true, token })
  }
  catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({ message: error.message });
  }
}

export { loginAdmin, registerAdmin };