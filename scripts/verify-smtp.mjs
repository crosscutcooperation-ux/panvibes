import nextEnv from '@next/env';
import nodemailer from 'nodemailer';
nextEnv.loadEnvConfig(process.cwd());
const port=Number(process.env.SMTP_PORT||465);
if(!process.env.SMTP_USER||!process.env.SMTP_PASSWORD)throw Error('Configure the server-only SMTP environment first.');
const transport=nodemailer.createTransport({host:process.env.SMTP_HOST||'smtp.gmail.com',port,secure:process.env.SMTP_SECURE?process.env.SMTP_SECURE==='true':port===465,requireTLS:port!==465&&process.env.SMTP_REQUIRE_TLS!=='false',auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASSWORD},connectionTimeout:10000,greetingTimeout:10000,socketTimeout:15000});
try{
 await transport.verify();console.log('PASS: SMTP connection and authentication.');
 if(process.argv.includes('--send-test')){
  if(!process.env.ENQUIRY_RECIPIENT)throw Error('Configure ENQUIRY_RECIPIENT first.');
  const result=await transport.sendMail({from:{name:'PanVibes Exim',address:process.env.SMTP_FROM||process.env.SMTP_USER},to:process.env.ENQUIRY_RECIPIENT,subject:'PanVibes website - SMTP setup verification',text:'This is a one-time setup verification for the PanVibes website enquiry notification system.\n\nThe Google SMTP connection has been configured for the designated sales mailbox. This is an internal test message, not a customer enquiry or order. No reply is required.'});
  if(!result.accepted.length)throw Error('The test recipient was not accepted.');
  console.log('PASS: internal setup test accepted by Google SMTP for the configured recipient.');
 }
}catch(error){console.error('SMTP check failed:',error.code||'SMTP_UNAVAILABLE',error.responseCode||'');process.exitCode=1;}
finally{transport.close();}
