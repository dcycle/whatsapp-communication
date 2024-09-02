// @ts-check
// The TypeScript engine will check all JavaScript in this file.

/**
 * Sending whatsapp functionality.
 */
class WhatsAppSend extends require('../component/index.js') {

  /**
   * Returns the dependencies.
   * @returns {String[]}
   */
  dependencies() {
    return [
      // Dependency on express module
      './express/index.js',
      './webhookWhatsApp/index.js',      
      './database/index.js',
      './env/index.js'
    ];
  }

  // app.c('whatsAppSend').sendWhatasppMessage({"message": "This is a test6", "sendTo":"+919632324012"});
  // app.c('whatsAppSend/index.js').sendWhatasppMessage({"message": "This is a test", "sendTo":"+919632324012"});  
  // curl -X POST --data '{"message": "This is a test", "sendTo":"+919632324012"}' http://0.0.0.0:8792/whatsappmessage/send
  // Initialization method to set up middleware and routes
  async run(app) {
    app.c('express').addRoute(
      'whatsappSend',
      // HTTP method for this route
      'post',
      // Route pattern with dynamic permissionId and file path
      //  http://0.0.0.0:8792/whatsapp-message/send
      '/whatsappmessage/send',
      async (req, res) => {
        this.sendWhatasppMessage(req.body).then((data) => {
          if (data) {
            res.status(200).send(JSON.stringify(req.body));
          }
          else {
            res.status(500).send("Message couldn't be send. Kindly check Error Logs.");
          }
        })
        .catch((error) => {
          console.error('Something bad happened:', error.toString());
        });
      }
    );

    // Return the instance of the class
    return this;
  }

  async sendWhatasppMessage(messageObject) {
    try {
      console.log("***** Inside whatsapp send message *****");
      if (this.app().c('env').required('WHATSAPP_DEV_MODE') === "false" ) {
        // Download the helper library from https://www.twilio.com/docs/node/install
        // @ts-expect-error
        const twilio = require("twilio");
        const twilioUser = this.app().c('env').required('TWILIO_USER');
        const authToken = this.app().c('env').required('TWILIO_PASS');
        const whatsappFrom = this.app().c('env').required('WHATSAPP_FROM');
        console.log("-------------------- twilio user -------------------");
        console.log(twilioUser);
        console.log(authToken);

        const client = twilio(twilioUser, authToken, { debug: true });

        // Extract the key from the object.
        const jsonString = Object.keys(messageObject)[0];
        // Parse the key to an object.
        const parsedObject = JSON.parse(jsonString);
        // const message = await client.messages.create({
        //   body: parsedObject.message,
        //   from: "whatsapp: " + whatsappFrom,
        //   to: "whatsapp: " + parsedObject.sendTo,
        // });
        const message = await client.messages.create({
          body: "Your appointment is coming up on July 21 at 3PM",
          from: "whatsapp:+15068049569",
          to: "whatsapp:+9632324012",
        });
        console.log("After log");
        console.log(message);
        return true;
      } else {
        // @ts-expect-error
        const fs = require('fs');
        const jsonMessage = JSON.stringify(messageObject);

        // Write to file first
        fs.writeFile('/output/whatsapp-send.json', jsonMessage, async (err) => {
          if (err) {
            console.error('Error writing to file:', err);
            return false;
          }
          console.log("whatsapp send message wrote to file successfully");
        });
        return true;
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new WhatsAppSend();
