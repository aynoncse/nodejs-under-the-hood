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

  if (!contentType || !contentType.includes('boundary=')) {
    return sendResponse(400, {
      status: 'fail',
      error: 'Invalid content type',
    });
  }

  const boundary = contentType.split('boundary=')[1];
  let chunks = [];

  req.on('data', (chunk) => chunks.push(chunk));

  req.on('end', () => {
    const buffer = Buffer.concat(chunks);

    // extract filename
    const headerMatch = buffer.toString('binary').match(/filename="(.+?)"/);
    const fileName = Date.now() + '_' + (headerMatch ? headerMatch[1] : 'unnamed');

    // locate file data between boundaries
    const boundaryBuffer = Buffer.from(`--${boundary}`);
    const startIdx = buffer.indexOf('\r\n\r\n', buffer.indexOf(boundaryBuffer)) + 4;
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
