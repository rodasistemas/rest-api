const mailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
const mailconfig = require("../config/mail.json");

const transport = mailer.createTransport({
    service:mailconfig.service,
    auth:{

        type: 'oauth2',  
        user:mailconfig.user,
        clientId:mailconfig.clientId,
        clientSecret:mailconfig.clientSecret,
        refreshToken:mailconfig.refreshToken
    
  }
   
});

transport.use('compile', hbs({
    viewEngine: {
      extName: '.html',
      partialsDir: path.resolve("./src/resources/mail/"),
      layoutsDir: path.resolve("./src/resources/mail/"),
      defaultLayout: 'auth/forgot-password.html',
    },
    viewPath: path.resolve("./src/resources/mail/"),
    extName: '.html',
  

    
    
    
    
}));
module.exports = transport;