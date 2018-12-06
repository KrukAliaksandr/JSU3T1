const fs = require('fs');
const XLSX = require('xlsx');

const writeToExcel = function writeToExcel (args, fileContents) {
  const workbook = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(fileContents);
  XLSX.utils.book_append_sheet(workbook, ws, 'Sheet1');
  XLSX.writeFile(workbook, args.path + '.xlsx');
};

const importFromExcel = function importFromExcel (args) {
  const workbook = XLSX.readFile(args.path + '.xlsx');
  const sheetNames = workbook.SheetNames;
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
  fs.writeFile(args.path + '.json', JSON.stringify(data, null, '\t'), 'utf8', () => {
    // eslint-disable-next-line no-console
    console.log(args.path + '.xlsx successfully Imported');
  });
};

module.exports.writeToExcel = writeToExcel;
module.exports.importFromExcel = importFromExcel;
