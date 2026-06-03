import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendAdminNotification = async (inquiry: any) => {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠️ SMTP credentials or ADMIN_EMAIL are missing. Email notification skipped.');
    return;
  }

  const itemsHtml = inquiry.items.map((item: any) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <strong>${item.product?.name || 'Unknown Product'}</strong><br/>
        <small>Qty: ${item.quantity}</small>
      </td>
    </tr>
  `).join('');

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
      <h2 style="color: #2b3a55; border-bottom: 2px solid #2b3a55; padding-bottom: 10px;">New Inquiry / Quote Request</h2>
      
      <p>A new inquiry has been submitted through the BPG Equipment platform.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${inquiry.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><a href="mailto:${inquiry.email}">${inquiry.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${inquiry.phone}</td>
        </tr>
        ${inquiry.message ? `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;" colspan="2">
            <strong>Message / Requirements:</strong><br/>
            <p style="background: #f9f9f9; padding: 10px; border-left: 3px solid #2b3a55; margin-top: 8px;">${inquiry.message}</p>
          </td>
        </tr>` : ''}
      </table>

      <h3 style="color: #2b3a55; margin-top: 30px;">Requested Equipment</h3>
      <table style="width: 100%; border-collapse: collapse;">
        ${itemsHtml}
      </table>
      
      <p style="margin-top: 30px; font-size: 12px; color: #888;">
        This is an automated notification from BPG Equipment Platform.
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"BPG Equipment System" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `🚨 New Inquiry Received: ${inquiry.name}`,
      html: htmlContent,
    });
    console.log(`✅ Admin notification email sent for inquiry ID: ${inquiry.id}`);
  } catch (error) {
    console.error('❌ Failed to send email notification:', error);
  }
};
