const nodemailer = require('nodemailer');
const { Readable } = require('stream'); // To create a readable stream
require('dotenv').config();
const password = process.env.GMAIL_PASSWORD;
const folderPath = process.env.FOLDER_PATH;
const pool = require('../config/postgres.config');
const fs = require('fs');
const path = require('path');


// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'khohalkirti@gmail.com',
        pass: password
    }
});

async function processFile(transporter, recipient, fileBuffer, filename, mimeType) {
    try {
        // Create a readable stream from the file buffer
        const fileStream = new Readable();
        fileStream.push(fileBuffer);
        fileStream.push(null); // End the stream

        // Create the full path for saving the file
        const filePath = path.join(folderPath, filename);

        // Write the file to the local folder
        const writeStream = fs.createWriteStream(filePath);
        await new Promise((resolve, reject) => {
            fileStream.pipe(writeStream);
            fileStream.on('end', resolve);
            fileStream.on('error', reject);
        });

        // Send email with the CSV attachment
        await transporter.sendMail({
            from: 'khohalkirti@gmail.com', // Sender's email address
            to: recipient, // Recipient's email address
            subject: 'Text File',
            text: 'Please find the attached file for approving/rejecting.',
            attachments: [
                {
                    filename: filename, // Set a filename for the attachment
                    path: filePath, // Set the path to the saved file
                    contentType: mimeType, // Set the MIME type
                },
            ],
        });

        return 1; // Return success
    } catch (error) {
        console.error("Error in mailing the text file:", error);
        return 0; // Return failure
    }
}


// Function to fetch a file by filename
async function getFile(filename) {
    try {

        // Create the full path to the requested file
        const filePath = path.join(folderPath, filename);

        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            return { error: 'File not found.' };
        }

        // Determine the MIME type based on the file extension (you can add more types as needed)
        let mimeType = 'application/octet-stream';
        // const extname = path.extname(filename);
        // if (extname === '.txt') {
        //     mimeType = 'text/plain';
        // } else if (extname === '.pdf') {
        //     mimeType = 'application/pdf';
        // } // Add more MIME types as needed

        return { filePath, mimeType };
    } catch (error) {
        console.error("Error in getFile function:", error);
        return { error: 'Internal Server Error' };
    }
}



async function updateDocumentStatus(username, documentStatus) {
    try {
        // Check if the user exists in the "Users" table
        const { rowCount } = await pool.query('SELECT * FROM Users WHERE username = $1', [username]);

        if (rowCount === 0) {
            return 0; // User not found
        }

        // Update the document_status for the user
        await pool.query('UPDATE Users SET document_status = $1 WHERE username = $2', [documentStatus, username]);

        return 1; // Document status updated successfully
    } catch (error) {
        console.error("Error in updateDocumentStatus function:", error);
        return -1; // Error occurred
    }
}

module.exports = { updateDocumentStatus, processFile, getFile, transporter };

