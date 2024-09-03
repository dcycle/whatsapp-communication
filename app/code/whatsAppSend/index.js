// @ts-check
// The TypeScript engine will check all JavaScript in this file.

/**
 * In order to send Whatsapp message ensure valid TWILIO_USER, TWILIO_PASS, WHATSAPP_FROM
 * WHATSAPP_DEV_MODE values
 * Present in .env file.
 *
 * If WHATSAPP_DEV_MODE=true then the message is saved to file ./unversioned/output/whatsapp-send.json
 * If WHATSAPP_DEV_MODE=false then the message is send to respective sendTo number.
 *
 * Ensure WHATSAPP_DEV_MODE=true in dev mode.
 *
 * Test whatsapp message sending functionality in terminal.
 *
 * access nodejs client ./scripts/node-cli.sh
 * Run below code by replacing country code and phone number.
 * >> await app.c('whatsAppSend').sendWhatasppMessage('{"message": "", "sendTo":"<country code><phone number>"}');
 *
 * example:-
 * >> await app.c('whatsAppSend').sendWhatasppMessage('{"message": "This is a test message", "sendTo":"+150XXXXXXX"}');
 *
 * Test whatsapp message sending functionality using curl.
 *
 * In dev environment:-
 * >> curl -X POST --data '{"message": "This is a test", "sendTo":"91XXXXXXXXX"}' http://0.0.0.0:8792/whatsappmessage/send
 *
 * In test environment:-
 * >> curl -X POST --data '{"message": "This is a test", "sendTo":"91XXXXXXXXXX"}' https://whatsapp-communication.dcycleproject.org/whatsappmessage/send
 *
 */

/**
 * Sending whatsapp messages functionality.
 *
 * ** note **
 * whatsapp messages are sent only in https enviroment.
 * Authentication failure Errors are logged in http environment.
 */
class WhatsAppSend extends require('../component/index.js') {

  /**
   * Returns the dependencies.
   * @returns {String[]}
   */
  dependencies() {
    return [
      // Dependency on express module.
      './express/index.js',
      // Depends on environment variable module.
      './env/index.js'
    ];
  }

  // Initialization method to set up middleware and routes
  async run(app) {
    app.c('express').addRoute(
      // Name of a Route.
      'whatsappSend',
      // HTTP method for this route.
      'post',
      // Route pattern.
      // http://0.0.0.0:8792/whatsappmessage/send
      '/whatsappmessage/send',
      (req, res) => {
        this.sendWhatasppMessage(req.body).then((data) => {
          if (data) {
            res.status(200).send("Message sent Successfully.!!");
          }
          else {
            res.status(500).send("*** Message couldn't be send. Kindly check Error Logs. ***");
          }
        })
        .catch((error) => {
          console.error('Something bad happened:', error.toString());
        });
      }
    );

    // Return the instance of the class.
    return this;
  }

  /**
   * Using Send Message We are sending messages.
   *
   * @param messageObject
   *   Object should have message and sendTo number to send message to respective number.
   *   '{"message": "This is a test", "sendTo":"+919632324012"}'
   *
   * @return
   *   returns true if message sent successfully else false.
   */
   async sendWhatasppMessage(messageObject) {
    try {
      // If messageObject is a string, convert it to the desired object pattern.
      if (typeof messageObject === 'string') {
        // Create the new object with the JSON string as the key and an empty string as the value.
        messageObject = { [messageObject]: '' };
      }

      // Ensure messageObject is an object and not null.
      if (typeof messageObject !== 'object' || messageObject === null) {
        throw new Error('Message object is not valid');
      }

      /**
       * WHATSAPP_DEV_MODE=false then messge sending functionality executed.
       * else messages are written to ./unversioned/output/whatsapp-send.json file.
       *
       * Ensure WHATSAPP_DEV_MODE=true in dev mode.
       */
      const isDevMode = this.app().c('env').required('WHATSAPP_DEV_MODE') === "false";

      if (isDevMode) {
        return await this.sendMessage(messageObject);
      } else {
        return this.writeMessageToFile(messageObject).then((data) => {
          if (data) {
            return true;
          }
          else {
            return false;
          }
        })
        .catch((error) => {
          console.error('Something bad happened:', error.toString());
          return false;
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      return false;
    }
  }

  /**
   * Sends a WhatsApp message using the Twilio API.
   * @param {Object} messageObject - The message object containing the message details.
   */
  async sendMessage(messageObject) {
    try {
      // Extract the key from the object.
      const jsonString = Object.keys(messageObject)[0];

      // Parse the key to an object.
      const parsedObject = JSON.parse(jsonString);

      // Validate the parsed object
      this.validateMessageObject(parsedObject);

      // Load Twilio helper library to send WhatsApp message
      // @ts-expect-error
      const twilio = require("twilio");

      // Load Twilio credentials and WhatsApp sending number
      const twilioUser = this.app().c('env').required('TWILIO_USER');
      const authToken = this.app().c('env').required('TWILIO_PASS');
      const whatsappFrom = this.app().c('env').required('WHATSAPP_FROM');

      // Authenticate with Twilio
      const client = twilio(twilioUser, authToken);

      // Send the message
      await client.messages.create({
        body: parsedObject.message,
        from: "whatsapp:" + whatsappFrom,
        to: "whatsapp:" + parsedObject.sendTo,
      });

      console.log('Message sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      return false;
    }
  }

  /**
   * Writes the message object to a file.
   * @param {Object} messageObject - The message object to write to a file.
   */
  async writeMessageToFile(messageObject) {
    try {
      // @ts-expect-error
      const fs = require('fs');
      const jsonMessage = JSON.stringify(messageObject);

      await fs.writeFile('/output/whatsapp-send.json', jsonMessage, (err) => {
        if (err) {
          console.log("WhatsApp send message Coudn't be Written to file. " + err);
          return false;
        }
        console.log("WhatsApp send message written to file successfully");
        return true;
      });
      return true;
    } catch (error) {
      console.error('Error writing to file:', error);
      return false;
    }
  }

  /**
   * Validates the parsed message object.
   * @param {Object} parsedObject - The parsed message object to validate.
   * @throws {Error} If the required parameters are missing.
   */
  validateMessageObject(parsedObject) {
    if (!parsedObject.sendTo && !parsedObject.message) {
      throw new Error('Missing required parameters: sendTo and/or message');
    }
  }

}

module.exports = new WhatsAppSend();
