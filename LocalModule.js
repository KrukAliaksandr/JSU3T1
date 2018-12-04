const todo = require('yargs');
const fs = require('fs');
const XLSX = require('xlsx');

export default function checkForFileContents (args, requiredFile) {
  const jsonFile = JSON.stringify(requiredFile);
  console.log(requiredFile);
  if (jsonFile.match(/(\[(\n)*((\t)|( ))*(((\t)|( ))*{\n((\t)|( ))*"[a-z]*": "[a-z]*",\n((\t)|( ))*"[a-z]*": "[a-z]*",\n((\t)|( ))*"[a-z]*": "[a-z]*"\n((\t)|( ))*},*\n*)*(\n)*\]?)/g)) {
    return requiredFile;
  } else if (jsonFile.match(/((\t)|( )|(\n))*(((\t)|( )|(\n))*{((\t)|( )|(\n))*"[a-z]*": "[a-z]*",((\t)|( )|(\n))*"[a-z]*": "[a-z]*"((\t)|( )|(\n)),((\t)|( )|(\n))*"[a-z]*": "[a-z]*"((\t)|( )|(\n))*},*((\t)|( )|(\n))*)*/g)) {
    let arrayForNotes = [];
    arrayForNotes.push(requiredFile);
    return arrayForNotes;
  } else {
    throw new Error('Invalid File contents');
  }
}

export default function writeNote (args, requiredFile) {
  const currentDate = new Date();
  const customDate = [currentDate.getMonth() + 1,
    currentDate.getDate(),
    currentDate.getFullYear()].join('/') + ' ' +
      [currentDate.getHours(),
        currentDate.getMinutes(),
        currentDate.getSeconds()].join(':');

  requiredFile.push({ title: args.title, body: args.body, date: customDate });
  fs.writeFileSync(args.path + '.json', JSON.stringify(requiredFile, null, '\t'), 'utf8', () => {
  });
}

export default function listNotes (args, requiredFile) {
  requiredFile.forEach(function (note) {
    console.log(note);
  });
}

export default function readNote (args, requiredFile) {
  const result = requiredFile.filter(function (note) {
    return note.title === args.title;
  });
  (result.length === 0) ? console.log('Nothing') : (console.log(result));
  return result[0];
}

export default function removeNote (args, requiredFile) {
  const result = requiredFile.filter((note) => note.title !== args.title);
  fs.writeFile(args.path + '.json', JSON.stringify(result, null, '\t'), 'utf8', () => {
    // eslint-disable-next-line no-console
    console.log(args.title + 'successfully Removed');
  });
}

export default function checkForNotesWithNeededTitle (args, file) {
  const result = file.filter(function (note) {
    return note.title === args.title;
  });
  console.log(result.length + ` notes with title "${args.title}" in file`);
  return result.length;
}

export default function updateNote (args, file) {
  const noteIndex = file.findIndex((note) => {
    return (note.title === args.title);
  });
  (args.updateType === 'title') ? (file[noteIndex].title = args.value) : (file[noteIndex].body = args.value);
  fs.writeFile(args.path + '.json', JSON.stringify(file, null, '\t'), 'utf8', () => {
    // eslint-disable-next-line no-console
    console.log(args.title + 'successfully Updated');
  });
}

export default function sortBy (args, file) {
  switch (args.type) {
    case 'date':
    {
      (args.order === 'ascending') ? file.sort(compareByDate) : (file.sort(compareByDate)).reverse();
      break;
    }
    case 'titleLength':
    {
      (args.order === 'ascending') ? file.sort(compareByTitleLength) : (file.sort(compareByTitleLength)).reverse();
      break;
    }
    case 'bodyLength':
    {
      (args.order === 'ascending') ? file.sort(compareByBodyLength) : (file.sort(compareByBodyLength)).reverse();
      break;
    }
    case 'alphabet':
    {
      (args.order === 'ascending') ? file.sort(compareByAlphabeticalOrder) : (file.sort(compareByAlphabeticalOrder)).reverse();
      break;
    }
  }
  fs.writeFile(args.path + '.json', JSON.stringify(file, null, '\t'), 'utf8', () => {
    // eslint-disable-next-line no-console
    console.log(args.path + 'successfully Sorted');
  });
}

export default function checkforNotesWithMissingBody (args, file) {
  const result = file.filter((note) => !('body' in note));
  result.forEach(note => {
    console.log(`note with ${note.title} + " is missing a body`);
  });
}

export default function compareByDate (a, b) {
  if (a.date < b.date) { return -1; }
  if (a.date > b.date) { return 1; }
  return 0;
}

export default function compareByTitleLength (a, b) {
  if (a.title.length < b.title.length) { return -1; }
  if (a.title.length > b.title.length) { return 1; }
  return 0;
}

export default function compareByBodyLength (a, b) {
  if (a.body.length < b.body.length) { return -1; }
  if (a.body.length > b.body.length) { return 1; }
  return 0;
}

export default function compareByAlphabeticalOrder (a, b) {
  if (a.localeCompare(b, 'en', { sensitivity: 'base' }) === -1) { return -1; }
  if (a.localeCompare(b, 'en', { sensitivity: 'base' }) === 1) { return 1; }
  return 0;
}

export default function writeToExcel (args, fileContents) {
  const workbook = XLSX.utils.book_new();
  // let wsData = [];
  // fileContents.forEach((note) => {
  //   let item = Object.values(note);
  //   wsData = wsData.concat([item]);
  // });
  // let ws = XLSX.utils.aoa_to_sheet(wsData);
  const ws = XLSX.utils.json_to_sheet(fileContents);
  XLSX.utils.book_append_sheet(workbook, ws, 'Sheet1');
  XLSX.writeFile(workbook, args.path + '.xlsx');
}

export function importFromExcel (args) {
  const workbook = XLSX.readFile(args.path + '.xlsx');
  const sheetNames = workbook.SheetNames;
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
  fs.writeFile(args.path + '.json', JSON.stringify(data, null, '\t'), 'utf8', () => {
    // eslint-disable-next-line no-console
    console.log(args.path + '.xlsx successfully Imported');
  });
}

// module.exports = checkForFileContents();
// module.exports = writeNote();
// module.exports = readNote();
// module.exports = removeNote();
// module.exports = listNotes();
// module.exports = checkForNotesWithNeededTitle();
// module.exports = checkforNotesWithMissingBody();
// module.exports = updateNote();
// module.exports = sortBy();
// module.exports = writeToExcel();
// module.exports = importFromExcel();
// module.exports = compareByAlphabeticalOrder();
// module.exports = compareByBodyLength();
// module.exports = compareByTitleLength();
// module.exports = compareByDate();
