// const transporter = require('../models/fileProcessor').transporter
// const pool = require('../config/postgres.config');
// require('dotenv').config();
// const admin = process.env.ADMIN_EMAIL;

// // Schedule a task to run periodically (e.g., every hour)
// async function document_approval() {
//     try {
//         // Find users with "pending_approval" status
//         const { rows, rowCount } = await pool.query('SELECT * FROM users WHERE document_status = $1', ['pending_approval']);
//         console.log("row count: ", rowCount);

//         // Iterate through the users and send approval emails
//         for (const user of rows) {
//             const recipientEmail = user.email; // Get the email address of the approver
//             const documentPath = user.document_path; // Get the document path

//             // Send an email to the approver with HTML content
//             await transporter.sendMail({
//                 from: admin,
//                 to: recipientEmail,
//                 subject: 'Document Approval Request',
//                 html: `
//         <html>
//             <body>
//                 <p>A document is awaiting your approval. Please review and approve or reject it.</p>
//                 <p>Document Link: <a href="${documentPath}">${documentPath}</a></p>
//             </body>
//         </html>
//     `,
//             });


//         }
//     } catch (error) {
//         console.error("Error in scheduled task:", error);
//     }
// }

// module.exports = { document_approval }
