require('dotenv').config();

const http = require('http');
const mongoose = require('mongoose');

// Connect to MongoDB Atlas
const dbURI = process.env.MONGO_URI;
if (!dbURI) {
  console.error('Error: MONGO_URI is not defined in .env file');
  process.exit(1);
}

mongoose
  .connect(dbURI, {
    dbName: 'mini-json-database',
  })
  .then(() => console.log('Successfully connected to MongoDB Atlas!'))
  .catch((err) => console.error('Error connecting to Atlas:', err));

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const User = mongoose.model('User', userSchema);

const getRequestBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk.toString()));
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
  });
};

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  // Get all Users
  if (url === '/users' && method === 'GET') {
    try {
      const users = await User.find();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(users));
    } catch (error) {
      res.writeHead(500);
      res.end('Server Error');
    }
  }

  // Create User
  else if (url === '/users' && method === 'POST') {
    try {
      const userData = await getRequestBody(req);
      const newUser = new User(userData);
      await newUser.save();
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          message: 'User created successfully',
          user: newUser,
        }),
      );
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
    
  } else if (url.startsWith('/users/') && method === 'DELETE') {
    const id = url.split('/')[2];

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(
        JSON.stringify({
          error: 'Invalid ID format. Must be a 24-character hex string.',
        }),
      );
    }

    try {
      await User.findByIdAndDelete(id);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User deleted successfully' }));
    } catch (error) {
      res.writeHead(404);
      res.end('User not found');
    }
  } else if (url.startsWith('/users/') && method === 'PUT') {
    const id = url.split('/')[2];

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(
        JSON.stringify({
          error: 'Invalid ID format. Must be a 24-character hex string.',
        }),
      );
    }
    
    try {
      const userData = await getRequestBody(req);
      const updatedUser = await User.findByIdAndUpdate(id, userData, {
        returnDocument: 'after',
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          message: 'User updated successfully',
          user: updatedUser,
        }),
      );
    } catch (error) {
      res.writeHead(404);
      res.end('User not found');
    }
  } else {
    res.writeHead(404);
    return res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
