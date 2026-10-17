import fs from 'node:fs/promises';
// Parse attributes as data. Never execute scripts from the source website.
const html=await fs.readFile(process.argv[2],'utf8');
const contacts=[...html.matchAll(/data-service="([^"]+)"[\s\S]*?data-contact-phone="([^"]+)"/g)].map(match=>{
  const attr=name=>match[0].match(new RegExp(`data-${name}="([^"]+)"`))?.[1];
  const title=value=>value.toLowerCase().replace(/\b\w/g,char=>char.toUpperCase());
  return {service:match[1],name:title(attr('contact-name').replace(/^MR\.\s*/,'')),role:title(attr('contact-role')),phone:`91${match[2]}`,features:attr('features').split('|')};
});
if(contacts.length!==5)throw new Error('Expected all five source service cards.');
await fs.writeFile('lib/service-contacts.json',JSON.stringify({source:'https://www.panvibesexim.com/service.php',sourceCaptured:'2026-10-13',checked:'2026-10-15',note:'Read from the saved original HTML; the live site timed out during this update.',contacts},null,2)+'\n');
console.log(contacts.map(item=>`${item.service}: ${item.name}`).join('\n'));
