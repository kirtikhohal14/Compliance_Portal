const express = require('express');
const fileProcessor = require('../models/fileProcessor');
const multer = require('multer');


const app = express();
app.use(express.json());

// Set up multer for handling file uploads
const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage });

// Define a route for uploading a text file
app.post('/upload-doc', upload.single('file'), async (req, res) => {
    try {
        const { recipient } = req.body;
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const result = await fileProcessor.processFile(fileProcessor.transporter, recipient, req.file.buffer, req.file.originalname, req.file.mimetype); // Pass the file buffer to processFile

        if (result === 1) {
            return res.status(201).json({ message: 'This file has been mailed successfully to the recipient' });
        } else {
            return res.status(500).json({ error: 'Failed to send the email' }); // Handle the error case properly
        }
    } catch (error) {
        console.error("Error in /upload route:", error);
        return res.status(500).json({ error: 'Internal Server Error' }); // Handle unexpected errors
    }
});


// Define a GET API to fetch a file by filename
app.get('/fetch-file', async (req, res) => {
    try {
        const { filename } = req.query;
        if (!filename) {
            return res.status(400).json({ error: 'Filename is required in the query parameters.' });
        }

        const result = await fileProcessor.getFile(filename);
        if (result.error) {
            return res.status(404).json({ error: result.error });
        }

        // Set the appropriate content type based on the file extension
        const mimeType = result.mimeType || 'application/octet-stream';
        res.setHeader('Content-Type', mimeType);

        // Set the Content-Disposition header to make the file downloadable
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        // Use res.download to send the file as an attachment
        res.download(result.filePath, filename);

    } catch (error) {
        console.error("Error in /fetch-file route:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Define a route for updating document status
app.post('/update-doc-status', async (req, res) => {
    try {
        const { username, document_status } = req.body;

        if (!username || !document_status) {
            return res.status(400).json({ error: 'Invalid request data' });
        }

        // Call the updateDocumentStatus function to update the document status for the user
        const result = await fileProcessor.updateDocumentStatus(username, document_status);

        if (result === 1) {
            return res.status(200).json({ message: 'Document status updated successfully' });
        } else {
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error("Error in /update-doc route:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = app;

