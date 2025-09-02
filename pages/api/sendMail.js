import formidable from "formidable";
import nodemailer from "nodemailer";

export const config = {
  api: {
    bodyParser: false, // required for formidable to handle file uploads
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Use the new way of initializing formidable
  const form = formidable({ multiples: false }); // `multiples: false` is good for single file uploads

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({ error: "Error parsing form data" });
    }

    // formidable's `fields` and `files` can sometimes return arrays
    // Use `[0]` to get the first item if they are arrays, or direct if they are not
    const designation = Array.isArray(fields.designation) ? fields.designation[0] : fields.designation;
    const hrEmail = Array.isArray(fields.hrEmail) ? fields.hrEmail[0] : fields.hrEmail;
    const resumeFile = Array.isArray(files.resume) ? files.resume[0] : files.resume;


    if (!designation || !hrEmail || !resumeFile) {
      console.error("Missing data:", { designation, hrEmail, resumeFile }); // Added this log for debugging
      return res.status(400).json({ error: "Missing designation, hrEmail, or resume" });
    }

    const resumePath = resumeFile.filepath || resumeFile.path; // Node 18+ uses filepath

    // Compose email
    const emailText = `
Dear Hiring Manager,
Hope you are doing well😊,
I am applying for the ${designation} role at your company.
Please find my resume attached.
I look forward to your response.

Best regards,
${process.env.MY_NAME}
${process.env.MY_MOBILE}
${process.env.MY_LINKEDIN}
    `;

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS, // App password
        },
      });

      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: hrEmail,
        subject: `Application for ${designation} Position`,
        text: emailText,
        attachments: [
          {
            filename: "resume.pdf",
            path: resumePath,
          },
        ],
      });

      console.log("Email sent successfully to", hrEmail);
      return res.status(200).json({ success: true, message: "Email sent successfully!" });
    } catch (error) {
      console.error("Email send error:", error);
      return res.status(500).json({ error: "Failed to send email" });
    }
  });
}