const resetPasswordTemplate = (link, username) => {
  return `
  
  <head>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
          }
          .email-container {
              max-width: 600px;
              margin: 20px auto;
              background: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .header {
              text-align: center;
              padding: 20px;
              background-color: #f0f0f0;
          }
          .header h1 {
              margin: 0;
              font-size: 18px;
              color: #333;
          }
          .image-container {
              text-align: center;
              padding: 20px;
          }
          .image-container img {
              max-width: 100%;
              height: auto;
          }
          .content {
              padding: 20px;
              text-align: center;
          }
          .content p {
              font-size: 16px;
              color: #555;
              margin: 10px 0;
          }
          .verification-code {
              font-size: 20px;
              font-weight: bold;
              color: #333;
          }
          .footer {
              padding: 20px;
              text-align: center;
              background-color: #f0f0f0;
          }
          .footer a {
              display: inline-block;
              padding: 10px 20px;
              color: #ffffff;
              background-color: #007BFF;
              text-decoration: none;
              border-radius: 5px;
          }
          .footer a:hover {
              background-color: #0056b3;
          }
      </style>
  </head>
  <body>
      <div class="email-container">
        <div class="header">
            <h1>Hello ${username}</h1>
            
        </div>
          <div class="footer">
              <a href="${link}">Click Me</a>
          </div>
      </div>
  </body>
  </html>
  `;
};

module.exports = { resetPasswordTemplate };
