/**
 * Restricted By Permission.
 * This class defines middleware and routes for handling access to restricted content based on permissions.
 */
class WebhookWhatsApp extends require('../component/index.js') {
  dependencies() {
    return [
      // Dependency on express module
      './express/index.js',
    ];
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
        const fs   = require('fs');

        fs.writeFile('/output/whatsapp.json', JSON.stringify(Object.keys(req)), (err) => {
          console.log(err);
        });;
        res.status(200).send(JSON.stringify(Object.keys(req)));
      }
    );

    // Return the instance of the class
    return this;
  }
}

// Export an instance of the RestrictedByPermission class
module.exports = new WebhookWhatsApp();
