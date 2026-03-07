const fs = require('fs');
const path = require('path');

// serve simple upload HTML form
exports.getUploadPage = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <html>
      <body>
        <form method="post" action="/upload" enctype="multipart/form-data">
          <input type="file" name="file">
          <input type="submit">
        </form>
      </body>
    </html>
  `);
};

// handle multipart file upload manually (no external libs)
exports.uploadFile = (req, res, sendResponse) => {
  const contentType = req.headers['content-type'];

  // 1. Basic content type check
  if (!contentType || !contentType.includes('boundary=')) {
    return sendResponse(400, {
      status: 'fail',
      error: 'Invalid content type',
    });
  }

  // 2. File size check (Reject by inspecting header before receiving data)
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (parseInt(req.headers['content-length']) > MAX_SIZE) {
    return sendResponse(413, {
      status: 'fail',
      message: 'File too large! Max limit 5MB.',
    });
  }

  const boundary = contentType.split('boundary=')[1];
  let chunks = [];

  let currentSize = 0;
  req.on('data', (chunk) => {
    currentSize += chunk.length;
    if (currentSize > MAX_SIZE) {
      req.destroy();
    }
    chunks.push(chunk);
  });

  req.on('end', () => {
    const buffer = Buffer.concat(chunks);

    // extract filename
    const headerMatch = buffer.toString('binary').match(/filename="(.+?)"/);

    if(!headerMatch) {
      return sendResponse(400, {
        status: 'fail',
        error: 'No file found in request',
      });
    }

    const originalName = headerMatch[1];
    const extension = path.extname(originalName).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

    if (!allowedExtensions.includes(extension)) {
      return sendResponse(400, {
        status: 'fail',
        message: 'Invalid file extension! Only images are allowed.',
      });
    }

    const fileName = Date.now() + '_' + (headerMatch ? headerMatch[1] : 'unnamed');

    // locate file data between boundaries
    const boundaryBuffer = Buffer.from(`--${boundary}`);
    const startIdx =
      buffer.indexOf('\r\n\r\n', buffer.indexOf(boundaryBuffer)) + 4;
    const endIdx = buffer.indexOf(`\r\n--${boundary}`, startIdx);

    if (startIdx === -1 || endIdx === -1) {
      return sendResponse(400, {
        status: 'fail',
        error: 'Error parsing file data',
      });
    }

    const fileData = buffer.slice(startIdx, endIdx);

    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, fileData);

    sendResponse(200, {
      status: 'success',
      message: 'Image uploaded successfully',
      file: fileName,
    });
  });
};
