require("dotenv").config()
const sgMail = require('@sendgrid/mail');
// console.log(process.env.SENDGRID_API_KEY)
sgMail.setApiKey(process.env.ID_API_KEY)
const  sendEmail= async (msg,emails)=>{
    
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
    to: emails, // replace these with your email addresses
    from: 'avaxia <boumenjel51@gmail.com>',
    subject: 'Shift planning ',
    text: 'Fresh donuts are out of the oven. Get them while they’re hot!',
    html: '<p>Fresh donuts are out of the oven. Get them while they’re <em>hot!</em></p>',
  

},emails)
}
module.exports =  sendEmail