const { default: makeWASocket, DisconnectReason, useSingleFileAuthState } = require('@adiwajshing/baileys')
const { Boom } = require('@hapi/boom')
const { state, saveState } = useSingleFileAuthState('./login.json')
let GlobalChat = 0

//asyc function

async function connectToWhatsApp() {
  //make qr wa
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    defaultQueryTimeoutMs: undefined
  })

  //listen connect updated
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update
    if (connection === "close") {
      const shouldReconnect = (lastDisconnect.error = Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('=> WhatsApp Disconect Reconnect')
      if (shouldReconnect) {
        connectToWhatsApp()
      }
    } else if (connection === 'open') {
      console.log('koneksi tersambung')
    }
  })

  sock.ev.on("creds.update", saveState)


// chat gpt import

const { Configuration, OpenAIApi } = require("openai");
const { generate } = require('qrcode-terminal');

const configuration = new Configuration({
  apiKey: process.env['API_KEY'],
});
const openai = new OpenAIApi(configuration);
//Fungsi OpenAI ChatGPT untuk Mendapatkan Respon
async function generateResponse(text) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: text,
    temperature: 0.3,
    max_tokens: 2000,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  });
  return response.data.choices[0].text;
}


  //fungsi penangkap pesan
  Maintenance = "31 Maret 2023"
  GlobalTextMenu = "Selamat Datang Di Bot Yohanes\n*GUNAKAN FITUR DENGAN BIJAK*\n\n1.Kirim pesan dan akhiri dengan tanda tanya\n  (?) untuk jawaban otomatis\n2. (/menu) untuk membuka menu\n3. (/info) untuk testing server\n\n ON GITHUB : https://github.com/yohanesokta"
  GlobalFooterGPT = "\n Ketik /menu untuk mengetahui fitur lebih banyak \n *BOT Yohanes Oktanio | GPT4*"

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type === "notify") {
      console.log('-------------------------------------------')
      try {
        const senderNumber = messages[0].key.remoteJid
          GlobalChat += 1
        //dapatkan pesan
        let incomingMessages = messages[0].message.conversation
        if (incomingMessages === "") {
          incomingMessages = messages[0].message.extendedTextMessage.text;
        }
        const isMessageFromGroup = senderNumber.includes('@g.us')
        const isMessageMentionBoot = incomingMessages.includes("@6281977330481")

        incomingMessages = incomingMessages.toLowerCase()
        console.log("nomor : ", senderNumber)
        console.log('IsI : ', incomingMessages)


  ID  = messages[0].key.id
  GlobalTextInfo = "*Sever Rendered*⚠️\n~Maintenance On "+ Maintenance +"~ \nServer On Replit \nID "+ID+"\nPesan Ke : "+GlobalChat+"\n\nWellcome to Yohanes Bot 🇮🇩"
        //if send
        if (isMessageFromGroup && isMessageMentionBoot && !incomingMessages.includes('/menu') && incomingMessages.includes('?')) {
          async function main() {
            const result = await generateResponse(incomingMessages)
            await sock.sendMessage(
              senderNumber,
              { text: result + GlobalFooterGPT },
              { quoted: messages[0] },
              2000
            )
          }
          main()
        }
        if (isMessageMentionBoot && incomingMessages.includes('/menu')) {
          await sock.sendMessage(
            senderNumber,
            {text: GlobalTextMenu},
            { quoted: messages[0] },
            2000
          )
        }
        if (!isMessageFromGroup && incomingMessages.includes('/menu')) {
          await sock.sendMessage(
            senderNumber,
            {text: GlobalTextMenu},
            { quoted: messages[0] },
            2000
          )
        }
        if (!isMessageFromGroup && incomingMessages.includes('?')) {
          async function msg() {
            await sock.sendMessage(
              senderNumber,
              { text: "*Mencari Jawaban Yang Tepat 😇*" },
              { quoted: messages[1] },
              2000
            )
          }

          async function main() {
            const result = await generateResponse(incomingMessages)
            console.log(result)
            await sock.sendMessage(
              senderNumber,
              { text: result + GlobalFooterGPT },
              { quoted: messages[0] },
              2000
            )
          }
          msg()
          main()
        }
        if (!isMessageFromGroup && incomingMessages.includes('/info')) {
          await sock.sendMessage(
            senderNumber,
            {text: GlobalTextInfo},
            { quoted: messages[0] },
            2000
          )
        }
        console.log('-------------------------------------------')


      }
      catch (error) {
        console.log("Error : Pesan Bukan Tulisan")
        console.log('-------------------------------------------')
      }
    }
  })
}

connectToWhatsApp().catch((err) => {
  console.log("Eneng Error : Reconneting")
})

// Stay

const keepAlive = require('./server');
const Monitor = require('ping-monitor');

keepAlive();
const monitor = new Monitor({
  website: '',
  title: 'NAME',
  interval: 2
});

monitor.on('up', (res) => console.log('its on.'));
monitor.on('down', (res) => console.log(`it has died `));
monitor.on('stop', (website) => console.log(`has stopped`));
monitor.on('error', (error) => console.log("Monitor error"));