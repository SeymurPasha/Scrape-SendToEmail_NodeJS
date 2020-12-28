const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs');
const nodemailer = require('nodemailer');
const download = require('image-downloader')
require('dotenv').config();
var transport = require('nodemailer-smtp-transport');

var schedule = require('node-schedule');
var j = schedule.scheduleJob('25 15 * * *', function(){
  
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
    }, 10000); 
          
}
})


  const sendToMe =  () => {
  var smtpTransport = nodemailer.createTransport(transport({ service: 'Gmail', port: 465, auth: { user: 'pashayevseymur42@gmail.com', pass: process.env.password } })); 
  var mailOptions = { from: 'pashayevseymur42@gmail.com', to: 'seymurpashayev2018@gmail.com', subject: 'Namaz vaxtı', attachments:[{path:'./images/12.jpg'}] }; 
  smtpTransport.sendMail(mailOptions, (error, response) => { 
    
  if(error) { console.log(error) 
  }
  
  else { console.log('Success') 
  } 
  smtpTransport.close(); 
  
  }); 
}
});


  




