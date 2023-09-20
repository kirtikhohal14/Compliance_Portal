const nodemailer = require('nodemailer');
const { Readable } = require('stream'); // To create a readable stream
require('dotenv').config();
const password = process.env.GMAIL_PASSWORD;
const folderPath = process.env.FOLDER_PATH;
const admin = process.env.ADMIN_EMAIL;
const pool = require('../config/postgres.config');
const fs = require('fs');
const path = require('path');


// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: admin,
        pass: password
    }
});

async function processFile(transporter, email, fileBuffer, filename, mimeType) {
    try {
        // Check if the recipient is a valid email in the database
        const { rowCount } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (rowCount === 0) {
            console.error("This email ID is not a valid email in the database");
            return 0; // Return failure
        }

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

        // Update the document_path for the user

        await pool.query('UPDATE users SET document_path = $1 WHERE email = $2', [filePath, email]);


        // Send email with the CSV attachment
        const mailInfo = await transporter.sendMail({
            from: admin, // Sender's email address
            to: email, // Recipient's email address
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

        if (mailInfo.messageId) {
            console.log("Email sent successfully:", mailInfo.response);
            return 1; // Return success
        } else {
            console.error("Error sending email:", mailInfo);
            return 0; // Return failure
        }
    } catch (error) {
        console.error("Error in processFile:", error);
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


        return { filePath, mimeType };
    } catch (error) {
        console.error("Error in getFile function:", error);
        return { error: 'Internal Server Error' };
    }
}



async function updateDocumentStatus(username, documentStatus) {
    try {
        // Check if the user exists in the "Users" table
        const { rowCount, rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (rowCount === 0) {
            return 0; // User not found
        }

        const user = rows[0]; // Get the user information

        // Update the document_status for the user
        await pool.query('UPDATE users SET document_status = $1 WHERE username = $2', [documentStatus, username]);

        if (documentStatus === "rejected") {
            // Fetch the document_path
            const documentPath = user.document_path;

            // Fetch the name of the approver (assuming the column is named 'approver_name')
            const approverName = user.name;

            // Construct the hyperlink
            const documentLink = `<a href="${documentPath}">${documentPath}</a>`;

            // Send an email to the admin with the document link and approver's name
            await transporter.sendMail({
                from: admin,
                to: admin, // Admin's email
                subject: 'Document Rejected',
                html: `Please correct the anomaly in the attached document and update it to send the approver again.<br>Approver's Name - ${approverName}<br>Document Link - ${documentLink}`,
            });
            console.log("Email sent to admin for correcting the anomaly");

            // Update the document_status back to "pending"
            await pool.query('UPDATE users SET document_status = $1 WHERE username = $2', ['document_under_correction', username]);
        }

        else if (documentStatus === "pending_approval") {
            const recipientEmail = user.email; // Get the email address of the approver
            const documentPath = user.document_path; // Get the document path

            // Send an email to the approver with HTML content
            await transporter.sendMail({
                from: admin,
                to: recipientEmail,
                subject: 'Document Approval Request',
                html: `
            <html>
                <body>
                    <p>A document is awaiting your approval. Please review and approve or reject it.</p>
                    <p>Document Link: <a href="${documentPath}">${documentPath}</a></p>
                </body>
            </html>
        `,
            });
        }

        return 1; // Document status updated successfully
    } catch (error) {
        console.error("Error in updateDocumentStatus function:", error);
        return -1; // Error occurred
    }
}


module.exports = { updateDocumentStatus, processFile, getFile, transporter };

