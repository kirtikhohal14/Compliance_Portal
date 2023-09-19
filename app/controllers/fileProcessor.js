const express = require('express');
const fileProcessor = require('../models/fileProcessor');
const multer = require('multer');


const app = express();
app.use(express.json());

// Set up multer for handling file uploads
const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage });


/**
 * @swagger
 * tags:
 *   name: File Management
 *   description: API endpoints for file management
 */

/**
 * @swagger
 * /upload-doc:
 *   post:
 *     summary: Upload a document
 *     description: Upload a text document and send it to a recipient.
 *     tags: [File Management]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Access token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               recipient:
 *                 type: string
 *     responses:
 *       '201':
 *         description: File uploaded successfully and email sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '400':
 *         description: Bad request or missing file
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

app.post('/upload-doc', upload.single('file'), async (req, res) => {
    try {
        const { recipient } = req.body;
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const result = await fileProcessor.processFile(fileProcessor.transporter, recipient, req.file.buffer, req.file.originalname, req.file.mimetype);

        if (result === 1) {
            return res.status(201).json({ message: 'This file has been mailed successfully to the recipient' });
        } else {
            return res.status(500).json({ error: 'Failed to send the email' });
        }
    } catch (error) {
        console.error("Error in /upload-doc route:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /fetch-file:
 *   get:
 *     summary: Fetch a file by filename
 *     description: Retrieve a file by providing its filename as a query parameter.
 *     tags: [File Management]
 *     parameters:
 *       - name: filename
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The filename of the file to fetch.
 *       - in: header
 *         name: x-access-token
 *         description: Access token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: File fetched successfully and available for download
 *       '400':
 *         description: Bad request or missing filename
 *       '404':
 *         description: File not found
 *       '500':
 *         description: Internal server error
 */
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

        const mimeType = result.mimeType || 'application/octet-stream';
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.download(result.filePath, filename);
    } catch (error) {
        console.error("Error in /fetch-file route:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /update-doc-status:
 *   post:
 *     summary: Update Document Status
 *     description: Update the status of a document for a specific user.
 *     tags: [File Management]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Access token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               document_status:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Document status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '400':
 *         description: Bad request or missing request data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       '401':
 *         description: Unauthorized - Access token is required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       '404':
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
app.post('/update-doc-status', async (req, res) => {
    try {
        const { username, document_status } = req.body;

        if (!username || !document_status) {
            return res.status(400).json({ error: 'Invalid request data' });
        }

        const result = await fileProcessor.updateDocumentStatus(username, document_status);

        if (result === 1) {
            return res.status(200).json({ message: 'Document status updated successfully' });
        } else {
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error("Error in /update-doc-status route:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = app;

