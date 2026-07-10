import nodemailer from 'nodemailer';

let transporter;

// Create transporter lazily or initially
export const getTransporter = async () => {
  if (transporter) return transporter;

  const isCustomSMTP = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

  if (isCustomSMTP) {
    console.log('Using configured SMTP settings for mail delivery.');
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    console.log('No SMTP config found. Creating an ephemeral Ethereal.email developer account...');
    try {
      const testAccount = await nodemailer.createTestAccount();
      console.log(`Ethereal Email account generated: ${testAccount.user}`);
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      });
      // Store test credentials in environment for persistent testing
      process.env.SMTP_USER = testAccount.user;
      process.env.SMTP_PASS = testAccount.pass;
    } catch (err) {
      console.error('Failed to create Ethereal test account:', err.message);
      // Fallback transporter that logs to console
      transporter = {
        sendMail: async (options) => {
          console.log('\n--- EMAIL OUTBOX FALLBACK (CONSOLE) ---');
          console.log(`To: ${options.to}`);
          console.log(`Subject: ${options.subject}`);
          console.log(`Body (HTML):\n${options.html}`);
          console.log('----------------------------------------\n');
          return { messageId: 'console-mock-id' };
        }
      };
    }
  }
  return transporter;
};

export const sendDownloadEmail = async ({ to, customerName, productName, downloadUrl }) => {
  try {
    const currentTransporter = await getTransporter();
    const fromAddress = process.env.FROM_EMAIL || '"Digital Bundle Marketplace" <noreply@digitalbundle.com>';

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
        <h2 style="color: #4f46e5; text-align: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">Your Digital Delivery is Ready! 🎉</h2>
        <p>Dear ${customerName},</p>
        <p>Thank you for purchasing <strong>${productName}</strong>. Your payment was processed successfully, and your secure download link is ready below.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${downloadUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 14px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">
            Download Your eBook PDF
          </a>
        </div>

        <p style="color: #64748b; font-size: 0.9em; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 15px;">
          Note: This download link is secure and restricted. Please do not share this link.
        </p>
        <p style="color: #94a3b8; font-size: 0.8em; text-align: center; margin-top: 5px;">
          If the button doesn't work, copy and paste this URL into your browser:<br/>
          <a href="${downloadUrl}" style="color: #4f46e5; word-break: break-all;">${downloadUrl}</a>
        </p>
      </div>
    `;

    const info = await currentTransporter.sendMail({
      from: fromAddress,
      to,
      subject: `Your Secure Download: ${productName}`,
      html: htmlContent,
    });

    console.log(`Email successfully dispatched. MessageId: ${info.messageId}`);
    
    // If using Ethereal, log the preview link for developers
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`\n📬 [DEVELOPER MAIL BOX] View test email in your browser here:`);
      console.log(`👉 ${previewUrl}\n`);
    }
    return { success: true, messageId: info.messageId, previewUrl };
  } catch (error) {
    console.error('Nodemailer Error Sending Email:', error);
    return { success: false, error: error.message };
  }
};
