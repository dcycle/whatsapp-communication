// @ts-check
// The TypeScript engine will check all JavaScript in this file.

/**
 * Whatsapp messages storing functionality.
 */
class WebhookWhatsApp extends require('../component/index.js') {

  /**
   * @property {Function} init Initializes this object.
   * @returns WebhookWhatsApp
   */
  async init(app)  {
    super.init(app);

    this.message = app.component('./database/index.js').mongoose().model('whatsappMessages', {
      SmsMessageSid: {
        type: String
      },
      NumMedia: {
        type: String
      },
      ProfileName: {
        type: String
      },
      MessageType: {
        type: String
      },
      SmsSid: {
        type: String
      },
      WaId: {
        type: String
      },
      SmsStatus: {
        type: String
      },
      Body: {
        type: String
      },
      To: {
        type: String
      },
      NumSegments: {
        type: String
      },
      ReferralNumMedia: {
        type: String
      },
      MessageSid: {
        type: String
      },
      AccountSid: {
        type: String
      },
      From: {
        type: String
      },
      ApiVersion: {
        type: String
      }
    });

    return this;
  }

  // https://github.com/jshint/jshint/issues/3361
  /* jshint ignore:start */
  message;
  /* jshint ignore:end */

  /**
   * Returns the dependencies.
   * @returns {String[]}
   */
  dependencies() {
    return [
      // Dependency on express module
      './express/index.js',
      './database/index.js',
      './bodyParser/index.js',
      './env/index.js'
    ];
  }

  collection() {
    return this.app().c('database').client()
      .db('login')
      .collection('whatsappMessages');
  }

  /**
   * Fetch the "whatsappMessages" model.
   */
   whatsappMessages() {
    // Sample usage:
    // this.whatsappMessages().find({},(err, messages)=> {
    //   return messages;
    // });

    return this.message;
  }

  /** Return true if the AccountSid is equivalent to the TWILIO_USER in .env */
  validateAuthenticatedMessage(
    messageObject /*:: : Object */
  ) {
    if (messageObject.AccountSid != undefined) {
      const twilioUser = this.app().c('env').required('TWILIO_USER');
      return messageObject.AccountSid === twilioUser;
    }
    else {
      return false;
    }
  }

  /** Store a message */
  async storeInMessageDetail(
    messageObject /*:: : Object */
  ) {
    try {
      const message = await this.whatsappMessages()(messageObject);
      message.save().then(async (value)=> {
        console.log("!! whatsapp message saved to database !!");
      }).catch((err)=>{
        console.log(err);
      });
    } catch (error) {
      // Handle Mongoose validation errors
      if (error.name === 'ValidationError') {
        console.error('Validation Error:', error.message);
        throw new Error('Validation error occurred while saving message details.');
      }
      // Handle other types of errors
      console.error('Error saving message:', error);
      throw new Error('An error occurred while saving message details.');
    }
  }

  // Initialization method to set up middleware and routes
  async run(app) {
    app.c('express').addRoute(
      'webhookWhatsApp',
      // HTTP method for this route
      'post',
      // Route pattern with dynamic permissionId and file path
      '/webhook/whatsapp',
      (req, res) => {
        // @ts-expect-error
        const fs = require('fs');
        const jsonMessage = JSON.stringify(req.body);

        // Write to file first
        fs.writeFile('/output/whatsapp.json', jsonMessage, async (err) => {
          if (err) {
            console.error('Error writing to file:', err);
            return res.status(500).send('Internal Server Error');
          }

          // Save to MongoDB after writing to file.
          try {
            let messageObject = req.body;
            if (this.validateAuthenticatedMessage(messageObject)) {
              await this.storeInMessageDetail(messageObject);
              // Send Confirmation message.
              await app.c('whatsAppSend').parsepropertySendMessage('{"message": "Well received!", "sendTo":'+req.body.WaId+'}');
              // https://stackoverflow.com/questions/68508372
              const resp = '<?xml version="1.0" encoding="UTF-8"?><Response>' + jsonMessage + '</Response>';
              res.status(200).send(resp);
            }
            else {
              console.log("Message is not from allowed ssid " + messageObject.AccountSid);
              res.status(403).send("Message is not from allowed to save from this account ssid" + messageObject.AccountSid);
            }
          } catch (error) {
            console.error('Error saving message:', error);
            res.status(500).send('Internal Server Error');
          }
        });
      }
    );

    // Return the instance of the class
    return this;
  }

}

module.exports = new WebhookWhatsApp();
