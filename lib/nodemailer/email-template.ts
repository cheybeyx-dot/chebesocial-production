interface EmailTemplateProps {
  subject: string;
  message: string;
  price: number;
  type: string;
  service: string;
  quantity: number;
  adlink: string;
  email: string | undefined;
  firstName: string | undefined;
}

export function emailTemplate({
  subject,
  message,
  price,
  type,
  service,
  quantity,
  adlink,
  email,
  firstName,
}: EmailTemplateProps): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #4CAF50;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          background-color: #ffffff;
          padding: 20px;
          border-radius: 0 0 5px 5px;
          border: 1px solid #eaeaea;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 12px;
          color: #666;
        }
        h1 {
          margin-top: 0;
        }
        p {
          margin: 0 0 15px;
        }
        .details {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        .details p {
          margin: 5px 0;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #4CAF50;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 15px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${subject}</h1>
        </div>
        <div class="content">
          ${firstName ? `<p>Dear ${firstName},</p>` : "<p>Hello,</p>"}
          <p>This is to inform you that a user has placed an order.</p>
          <div class="details">
            <h2>Order Details:</h2>
            <p><strong>Service:</strong> ${service}</p>
            <p><strong>Type:</strong> ${type}</p>
            <p><strong>Quantity:</strong> ${quantity}</p>
            <p><strong>Price:</strong> NGN${price.toFixed(2)}</p>
            ${adlink ? `<p><strong>Ad Link:</strong> ${adlink}</p>` : ""}
            ${email ? `<p><strong>Email:</strong> ${email}</p>` : ""}
          </div>
          <p>${message}</p>
          <p>You can view your ad by clicking the button below:</p>
          <a href="https://classic-media-admin.vercel.app" class="button">View Your Ad</a>
          <p>If you have any questions or concerns about your order, please don't hesitate to contact our customer support team.</p>
          <p>Thank you for choosing our service!</p>
          <p>Best regards,<br>Chebe Social</p>
        </div>
        <div class="footer">
          <p>This is an automated email, please do not reply directly to this message.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
