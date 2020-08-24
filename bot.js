require('dotenv').config();
const { Telegraf } = require('telegraf');
const api = require('covid19-api');
const Markup = require('telegraf/markup');
const COUNTRIES_list = require('./countryList');

const bot = new Telegraf(process.env.BOT_TOKEN);

//Вывод всех стран списком
bot.help((ctx) => ctx.reply(COUNTRIES_list));

//Приветствие
bot.start((ctx) =>
  ctx.reply(
    `
  Приветствую, ${ctx.from.first_name}!\n
Введите на английском название страны, чтобы получить статистику.

Чтобы получить список всех доступных стран введите команду: \/help или нажнмите на соотвествующую кнопку.

Чтобы показать инструкцию введите команду: \/start или нажнмите на соотвествующую кнопку.
`,
    Markup.keyboard([
      ['Russia', 'Ukraine'],
      ['Belarus', 'Kazakhstan'],
      ['/help', '/start'],
    ])
      .resize()
      .extra()
  )
);

//Вывод данных по стране
bot.on('text', async (ctx) => {
  let data = {};
  try {
    data = await api.getReportsByCountries(ctx.message.text);
    ctx.reply(
      `Страна: ${data[0][0].country}
-------------------------------
Случаев заражения: ${data[0][0].cases}
Смертей: ${data[0][0].deaths}
Выздоровело: ${data[0][0].recovered}
Cмертность: ${((data[0][0].deaths / data[0][0].cases) * 100).toFixed(1)}%
-------------------------------`,
      Markup.inlineKeyboard([
        Markup.urlButton(
          '➡️ Support',
          'https://www.instagram.com/rogalik_s_makom'
        ),
      ])
        .resize()
        .extra()
    );
  } catch {
    console.log('Ошибка');
    ctx.reply('Ошибка, такой страны не существует!');
  }
});

bot.launch();
