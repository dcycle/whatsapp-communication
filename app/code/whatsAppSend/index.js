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
      './webhookWhatsApp/index.js',      
      './database/index.js',
      './env/index.js'
    ];
  }

  // app.c('whatsAppSend').sendWhatasppMessage({"message": "This is a test", "sendTo":"+919632324012"});
  // app.c('whatsAppSend/index.js').sendWhatasppMessage({"message": "This is a test", "sendTo":"+919632324012"});  
  // curl -X POST --data '{"message": "This is a test", "sendTo":"+919632324012"}' http://0.0.0.0:8792/whatsappmessage/send
  // Initialization method to set up middleware and routes
  async run(app) {
    app.c('express').addRoute(
      'whatsapp_send',
      // HTTP method for this route
      'post',
      // Route pattern with dynamic permissionId and file path
      //  http://0.0.0.0:8792/whatsapp-message/send
      '/whatsappmessage/send',
      async (req, res) => {
        await this.sendWhatasppMessage(req.body);
      }
    );

    // // Return the instance of the class
    return this;
  }

  sendWhatasppMessage(messageObject) {
    try {
      console.log("***** Inside whatsapp send message *****");
      if (!this.app().c('env').required('WHATSAPP_DEV_MODE')) {
        // Download the helper library from https://www.twilio.com/docs/node/install
        // @ts-expect-error
        const twilio = require("twilio");
        const twilioUser = this.app().c('env').required('TWILIO_USER');
        const authToken = this.app().c('env').required('TWILIO_PASS');
        const whatsappFrom = this.app().c('env').required('WHATSAPP_FROM');
        const client = twilio(twilioUser, authToken);

        const message = client.messages.create({
          body: messageObject.message,
          from: whatsappFrom,
          to: messageObject.sendTo,
        });

        console.log(message.body);
      } else {
        // @ts-expect-error
        const fs = require('fs');
        const jsonMessage = JSON.stringify(messageObject);

        // Write to file first
        fs.writeFile('/output/whatsapp-send.json', jsonMessage, async (err) => {
          if (err) {
            console.error('Error writing to file:', err);
          }
          console.log("whatsapp send message wrote to file succussfully");
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new WhatsAppSend();
