import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_digital_bundle_123';

// Seed default admin if no administrator is registered
export const seedDefaultAdmin = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('adminpassword123', 10);
      const defaultAdmin = new Admin({
        username: 'admin',
        password: hashedPassword
      });
      await defaultAdmin.save();
      console.log('----------------------------------------------------');
      console.log('Seeded Default Admin Credentials:');
      console.log('Username: admin');
      console.log('Password: adminpassword123');
      console.log('----------------------------------------------------');
    }
  } catch (error) {
    console.error('Failed to seed default admin user:', error.message);
  }
};

export const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid admin credentials.' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin credentials.' });
    }

    // Sign Token
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username
      }
    });
  } catch (error) {
    console.error('Login Admin Error:', error);
    res.status(500).json({ message: 'Server error during login processing.' });
  }
};

export const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin profile not found.' });
    }
    res.json(admin);
  } catch (error) {
    console.error('Get Me Auth Error:', error);
    res.status(500).json({ message: 'Server error during session verification.' });
  }
};
