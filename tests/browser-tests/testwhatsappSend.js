const { expect } = require('chai');
const fs = require('fs');

it("send whatsapp message should send to a respective sendTo number or written to file.", async function() {
  console.log('Testing ' + __filename);
  try {
    const whatsappDev = process.env.WHATSAPP_DEV_MODE;
    const response = await fetch('http://node:8080/whatsappmessage/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {"message": "This is a test", "sendTo":"91XXXXXXXXX"}
      )
    });

    // developement environment.
    if (whatsappDev === "true") {
      // Read the file asynchronously
      await fs.readFile('/unversioned/output/whatsapp-send.json', 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading the file:', err);
          return;
        }
        console.log("Confirm that Message saved to file in development environment");
        expect(data.includes('This is a test message')).to.be.true;
      });
    }
    else {
      console.log("Confirm that Message send to number in production environment");
    }
    console.log("Confirm that Message sent successfully");
    expect(response.status).to.equal(200);
  }
  catch (error) {
    console.log(error);
  }
});

it("verify Message couldn't be send case.", async function() {
  console.log('Testing ' + __filename);
  try {
    const whatsappDev = process.env.WHATSAPP_DEV_MODE;
    const response = await fetch('http://node:8080/whatsappmessage/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {"sendTo":"91XXXXXXXXX"}
      )
    });

    console.log("Confirm that Message couldn't be send. Kindly check Error Logs. case");
    expect(response.status).to.equal(500);
  }
  catch (error) {
    console.log(error);
  }
});
