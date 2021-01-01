const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs');
glob = require('glob')
const nodemailer = require('nodemailer');
const download = require('image-downloader')
require('dotenv').config();
var transport = require('nodemailer-smtp-transport');

const myPath =  './images/**/*.jpg';
let attachment = '';

  
  request('https://www.qafqazislam.com/index.php?lang=az&sectionid=123', (error,response, html) => {
  if(!error && response.statusCode == 200) {
    const $ = cheerio.load(html)

    const linkToImage = 'https://www.qafqazislam.com' +  $('.containertext2').children('img').attr('src') 
    console.log(linkToImage);

    const options = {
      url: linkToImage,
      dest: './images'                
    }
    
    download.image(options)
      .then(({ filename }) => {
        console.log('Saved to', filename)  
      })
      .catch((err) => console.error(err))


    setTimeout(() => {
      sendToMe()
    }, 3000); 
          
}
})



glob(myPath, function (er, files) {
  console.log(files);
  attachment = files[0]
})

  const sendToMe =  () => {
  var smtpTransport = nodemailer.createTransport(transport({
    host: 'smtp.gmail.com', 
    service: 'Gmail', port: 465, 
    auth: {type: 'OAuth2', user:  'pashayevseymur42@gmail.com', pass: process.env.password },
    tls:{rejectUnauthorized:false}
  })); 
  var mailOptions = { from: 'pashayevseymur42@gmail.com', to: 'seymurpashayev2018@gmail.com', subject: 'Namaz vaxtı', attachments:[{path: attachment}] }; 
  smtpTransport.sendMail(mailOptions, (error, response) => { 
    
  if(error) { console.log(error) 
  }
  
  else { console.log('Success') 
  } 
  smtpTransport.close(); 
  
  }); 
}

  
  






  




