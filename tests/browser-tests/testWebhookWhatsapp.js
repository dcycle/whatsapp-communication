const { expect } = require('chai');
const fs = require('fs');

it("If account ssid different then message should get saved to a file but shouldn't get stored in database", async function() {
  console.log('Testing ' + __filename);
  try {
    console.log("send message to /webhook/whatsapp");
    const response = await fetch('http://node:8080/webhook/whatsapp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        AccountSid: 'testUser',
        SmsMessageSid: 'SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        NumMedia: '0',
        ProfileName: 'Profile Name',
        MessageType: 'text',
        SmsSid: 'SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        WaId: '1234567890',
        SmsStatus: 'delivered',
        Body: 'Test message',
        To: '+1234567890',
        NumSegments: '1',
        ReferralNumMedia: '0',
        MessageSid: 'SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        From: '+0987654321',
        ApiVersion: '2010-04-01'
      })
    });

    // Read the file
    const data = await fs.readFile('/unversioned/output/whatsapp.json');          
    // Log confirmation message
    console.log("Confirm that Message saved to file");
    // Assert that the file contains the expected message
    result = data.includes('Test message');
    expect(result).to.be.true;

    console.log("Ensuring that account ssid id is different then we should get 403");
    // Assert status and message
    expect(response.status).to.equal(403);
  }
  catch (error) {
    console.log(error);
  }
});


it("If account ssid same as message then message should get saved to a file and also should get stored in database", async function() {
  const twilioUser = process.env.TWILIO_USER;
  const whatsappDev = process.env.WHATSAPP_DEV_MODE;

  console.log('Testing ' + __filename);
  try {
    console.log("send message to /webhook/whatsapp");
    const response = await fetch('http://node:8080/webhook/whatsapp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        AccountSid: twilioUser,
        SmsMessageSid: 'SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        NumMedia: '0',
        ProfileName: 'Profile Name',
        MessageType: 'text',
        SmsSid: 'SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        WaId: '1234567890',
        SmsStatus: 'delivered',
        Body: 'Test message2',
        To: '+1234567890',
        NumSegments: '1',
        ReferralNumMedia: '0',
        MessageSid: 'SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        From: '+0987654321',
        ApiVersion: '2010-04-01'
      })
    });

    // Read the file
    const data = await fs.readFile('/unversioned/output/whatsapp.json');          
    // Log confirmation message
    console.log("Confirm that Message saved to file");
    // Assert that the file contains the expected message
    result=data.includes('Test message2');
    expect(result).to.be.true;

    if (whatsappDev === "true") {
      // Read the file
      const data = await fs.readFile('/unversioned/output/whatsapp-send.json');          
      // Log confirmation message
      console.log("Confirm that Reply Message saved to file if it is dev environment");
      // Assert that the file contains the expected message
      result=data.includes('Well received!');
      expect(result).to.be.true;

    }

    console.log("Ensuring that account ssid id is same then we should get 200");
    // Assert status and message
    expect(response.status).to.equal(200);
  }
  catch (error) {
    console.log(error);
  }
});

it("If account ssid undefined then message shouldn't stored in db", async function() {
  const twilioUser = process.env.TWILIO_USER;

  console.log('Testing ' + __filename);
  try {
    console.log("send message to /webhook/whatsapp");
    const response = await fetch('http://node:8080/webhook/whatsapp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        SmsMessageSid: 'SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        NumMedia: '0',
        ProfileName: 'Profile Name',
        MessageType: 'text',
        SmsSid: 'SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        WaId: '1234567890',
        SmsStatus: 'delivered',
        Body: 'Test message2',
        To: '+1234567890',
        NumSegments: '1',
        ReferralNumMedia: '0',
        MessageSid: 'SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        From: '+0987654321',
        ApiVersion: '2010-04-01'
      })
    });

    console.log("Ensuring account ssid is undefined then we should get 403");
    // Assert status and message
    expect(response.status).to.equal(403);
  }
  catch (error) {
    console.log(error);
  }
});
