const fs = require('fs');
const XLSX = require('xlsx');

const writeToExcel = function (args, fileContents) {
  const workbook = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(fileContents);
  XLSX.utils.book_append_sheet(workbook, ws, 'Sheet1');
  XLSX.writeFile(workbook, args.path + '.xlsx');
};

const importFromExcel = function (args) {
  const uniqueNotesMap = new Map();
  const uniqueData = [];
  const workbook = XLSX.readFile(args.path + '.xlsx');
  const sheetNames = workbook.SheetNames;
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
  //проверка на дубликаты
  data.forEach((note) => {
    uniqueNotesMap.set(note.title, note);
  });
  uniqueNotesMap.forEach((value, key) => {
    uniqueData.push(value);
  });
  fs.writeFile(args.path + '.json', JSON.stringify(uniqueData, null, '\t'), 'utf8', () => {
    // eslint-disable-next-line no-console
    console.log(args.path + '.xlsx successfully Imported');
  });
};

const checkForFileExistense = function (path, extension) {
  if (!fs.existsSync(`${path}.${extension}`)) {
    fs.writeFileSync(`${path}.${extension}`, '[\r\n]', 'utf8');
    console.log(`file ${path}.${extension} does not exist. Created new file with the same name`);
  }
  return JSON.parse(fs.readFileSync(`${path}.${extension}`, 'utf8'));
};

module.exports = {
  writeToExcel,
  importFromExcel,
  checkForFileExistense
};
