require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

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
  name: String,
  email: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const User = mongoose.model('User', userSchema);

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
    let body = '';

    req.on('data', (chunk) => (body += chunk.toString()));

    req.on('end', async () => {
      try {
        const userData = JSON.parse(body);
        const newUser = new User({
          name: userData.name,
          email: userData.email,
          id: uuidv4(),
        });
        await newUser.save();
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User created successfully', user: newUser }));
      } catch (error) {
        res.writeHead(500);
        res.end('Server Error');
      }
    });

  } else if (url.startsWith('/users/') && method === 'DELETE') {
    const id = url.split('/')[2];

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

    let body = '';
    req.on('data', (chunk) => (body += chunk.toString()));

    req.on('end', async() => {
      try {
        const updateData = JSON.parse(body);
        const updatedUser = await User.findByIdAndUpdate(id, updateData, {
          returnDocument: 'after',
        });
        res.end(
          JSON.stringify({
            message: 'User updated successfully',
            user: updatedUser,
          }),
        );
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            error: 'Update failed',
          }),
        );
      }
    });
  } else {
    res.writeHead(404);
    return res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
