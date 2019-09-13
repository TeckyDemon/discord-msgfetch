const {writeFile}=require('fs')
const {Client}=require('discord.js')
client=new Client()
config=require('./config.json')

client.on('ready',async ()=>{
	writeFile(config.outputFilename,
		JSON.stringify((await Promise.all(client
			.guilds.find(g=>g.id===config.serverID)
			.channels.filter(c=>c.type=='text')
			.map(async c=>[c.id,await c.fetchMessages({limit:100})])))
			.map(c=>[c[0],c[1].filter(m=>!m.author.bot).map(m=>[m.id,{
				'timestamp' : m.createdTimestamp,
				'author'    : m.author.id,
				'content'   : m.content
			}])])
			.reduce((h1,c)=>{
				h1[c[0]]=c[1].length==0?{}:c[1].reduce((h2,m)=>{
					h2[m[0]]=m[1];return h2
				},{});return h1
			},{}),
		null,4)
	,function(){})
	await client.destroy()
})

client.login(config.clientToken)
