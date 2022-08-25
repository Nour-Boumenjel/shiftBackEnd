
require("dotenv").config()
const sgMail = require('@sendgrid/mail');
// console.log(process.env.SENDGRID_API_KEY)
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const  sendEmail= async (msg)=>{
    
    try{
        await sgMail.send(msg)
        console.log('emails sent successfully!');
    }
      
      
       
catch(error){
    console.error(error);
    if (error.response){
        console.error(error.response.body)
    }
};
sendEmail({
    to: ['boumenjel51@gmail.com', 'example2@mail.com'], // replace these with your email addresses
    from: 'Sadie Miller <sadie@thebigdonut.party>',
    subject: '🍩 Donuts, at the big donut 🍩',
    text: 'Fresh donuts are out of the oven. Get them while they’re hot!',
    html: '<p>Fresh donuts are out of the oven. Get them while they’re <em>hot!</em></p>',
  

})
}
module.exports =  sendEmail