import 'dotenv/config'; // Читаем настройки из .env
import fs from 'node:fs';
import readline from 'node:readline';

async function run() {
  // 1. Проверяем, есть ли файл. Если нет — выключаемся
  if (!fs.existsSync(process.env.INPUT_FILE)) {
    console.error(`Ошибка: файла ${process.env.INPUT_FILE} нет!`);
    process.exit(1); 
  }

  // 2. Открываем потоки (читаем по одной строчке и готовимся писать результат)
  const reader = readline.createInterface({ input: fs.createReadStream(process.env.INPUT_FILE) });
  const writer = fs.createWriteStream(process.env.OUTPUT_FILE);

  let total = 0, passed = 0, isHeader = true;

  // 3. Листаем файл строчка за строчкой
  for await (const line of reader) {
    if (isHeader) {
      writer.write(line + '\n'); // Первую строчку с заголовками просто копируем
      isHeader = false;
      continue;
    }

    total++; // Считаем человека
    const [id, name, age, city] = line.split(','); // Режем строку по запятым

    // 4. Проверяем условия из .env (возраст и город)
    if (Number(age) >= Number(process.env.MIN_AGE) && city.trim() === process.env.CITY_FILTER) {
      writer.write(line + '\n'); // Если подошел — записываем в новый файл
      passed++; // Считаем красавчика
    }
  }

  writer.end(); // Закрываем файл с результатом
  console.log(`Готово! Обработано строк: ${total}, Прошло фильтр: ${passed}`);
}

run();
