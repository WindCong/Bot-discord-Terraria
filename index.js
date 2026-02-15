const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');
const cron = require('node-cron');

const TOKEN = 'MTQ3MjYwMjI4ODc5ODQzMzM2Mw.Gyrq5E.rbI9EuhXihQYP5Ic3mZq-HLosOwW6PgJYN8uNo';
const CHANNEL_ID = '1472608837428314274';

// link workshop (có thể thay bằng tag khác)
const WORKSHOP_URL =
  'https://steamcommunity.com/workshop/browse/?appid=1281930&browsesort=trend&section=readytouseitems';

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// ===============================
// HÀM LẤY MOD RANDOM
// ===============================
async function getRandomMod() {
  const { data } = await axios.get(WORKSHOP_URL);
  const $ = cheerio.load(data);

  const items = $('.workshopItem');
  const random = Math.floor(Math.random() * items.length);
  const item = items.eq(random);

  const name = item.find('.workshopItemTitle').text().trim();
  const url = item.attr('href');
  const image = item.find('img').attr('src');

  return { name, url, image };
}

// ===============================
// POST MOD
// ===============================
async function postRandomMod() {
  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    const mod = await getRandomMod();

    const embed = new EmbedBuilder()
      .setTitle(mod.name)
      .setURL(mod.url)
      .setImage(mod.image)
      .setDescription('🎲 Random mod of the day!')
      .setColor(0x00AE86);

    channel.send({ embeds: [embed] });
  } catch (err) {
    console.log(err);
  }
}

// ===============================
// MỖI NGÀY 1 LẦN – 9H SÁNG
// ===============================
cron.schedule('0 9 * * *', () => {
  postRandomMod();
});

client.login(TOKEN);
