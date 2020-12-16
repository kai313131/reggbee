const { MessageEmbed } = require('discord.js');
const parseMilliseconds = require('parse-ms');
const db = require("quick.db");
const ayarlar = require("../ayarlar.json");

module.exports.execute = async (client, message, args, conf, emoji) => {
    const timeout = 86400000 // Burada Komut kullanım süremiz 24 Saattir. Değiştirebilirsiniz.
    const miafKomutSınır = 10 // burada komutu kullanma sınırımız yani bu komutu 24 saatte 3 kere kullanabiliriz.
    const embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor(client.randomColor());
    if (!message.member.roles.cache.has("787331142483181609")) return message.react("775403759726493706");
    const daily = db.fetch(`MiafSınır_${message.guild.id}_${message.author.id}`); 
    if (daily !== null && timeout - (Date.now() - daily) > 0) { let time = parseMilliseconds(timeout - (Date.now() - daily)); 
        message.channel.send(`Komut Kullanma Sınırını Aştın. **${time.hours} Saat ${time.minutes} Dakika ${time.seconds} Saniye** Sonra tekrar dene.`)
    } else {
    await db.add(`CommandPoint_${message.guild.id}_${message.author.id}`, 1) 
    await db.add('UyarıCommand_'+message.guild.id+'_'+message.author.id, 1)
    const name = args.slice(0).join(' ');
    let isim;
    if (!name) return message.reply('Geçerli bir isim belirtmelisin.').then(x => x.delete({ timeout: 5000 }));
    isim = `${message.author.username.includes("✧") ? "✧" : "✦"} ${name}`
    if(isim.length > 32) return message.reply('Maksimum 32 karakter sınırı var.');
    message.member.setNickname(isim);
    message.react("775403774541430784");
    const uyarıs = await db.fetch('UyarıCommand_'+message.guild.id+'_'+message.author.id)
let ToplamSayı = db.fetch(`CommandPoint_${message.guild.id}_${message.author.id}`) || `Hiç Kullanmamış!` 
await message.channel.send(new MessageEmbed().setDescription(`Bu komutu toplamda ${ToplamSayı} Kullandın! Kalan hakkın ${uyarıs}/${miafKomutSınır}`).setTimestamp().setColor("RANDOM").setFooter(`Kai is god`));
if(uyarıs > miafKomutSınır -1) {
    await db.set('MiafSınır_'+message.guild.id+'_'+message.author.id, Date.now())
    await db.delete(`UyarıCommand_${message.guild.id}_${message.author.id}`)
    }}} 

module.exports.configuration = {
    name: 'booster',
    aliases: ['booster','boosterisim'],
    usage: 'booster [isim]',
    description: 'İsminizi değiştirir.',
    permLevel: 0
};
