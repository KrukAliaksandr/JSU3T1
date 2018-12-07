const fs = require('fs');

const checkForFileContents = function checkForFileContents (args, requiredFile) {
  const jsonFile = JSON.stringify(requiredFile);
  if (jsonFile.match(/(\[(\n)*((\t)|( ))*(((\t)|( ))*{\n((\t)|( ))*"[a-z]*": "[a-z]*",\n((\t)|( ))*"[a-z]*": "[a-z]*",\n((\t)|( ))*"[a-z]*": "[a-z]*"\n((\t)|( ))*},*\n*)*(\n)*\]?)/g)) {
    return requiredFile;
  } else if (jsonFile.match(/((\t)|( )|(\n))*(((\t)|( )|(\n))*{((\t)|( )|(\n))*"[a-z]*": "[a-z]*",((\t)|( )|(\n))*"[a-z]*": "[a-z]*"((\t)|( )|(\n)),((\t)|( )|(\n))*"[a-z]*": "[a-z]*"((\t)|( )|(\n))*},*((\t)|( )|(\n))*)*/g)) {
    let arrayForNotes = [];
    arrayForNotes.push(requiredFile);
    return arrayForNotes;
  } else {
    throw new Error('Invalid File contents');
  }
};

const writeNote = function writeNote (args, requiredFile) {
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
};

const listNotes = function listNotes (args, requiredFile) {
  requiredFile.forEach(function (note) {
    console.log(JSON.stringify(note, null, '\t').replace('{', '').replace('}', ''));
  });
};

const readNote = function readNote (args, requiredFile) {
  const result = requiredFile.filter(function (note) {
    return note.title === args.title;
  });
  (result.length === 0) ? console.log('Nothing') : (console.log(result));
  return result[0];
};

const removeNote = function removeNote (args, requiredFile) {
  const result = requiredFile.filter((note) => note.title !== args.title);
  fs.writeFile(args.path + '.json', JSON.stringify(result, null, '\t'), 'utf8', () => {
    // eslint-disable-next-line no-console
    console.log(args.title + 'successfully Removed');
  });
};

const checkForNotesWithNeededTitle = function (title, file) {
  const result = file.filter(function (note) {
    console.log(note);
    return note.title === title;
  });
  console.log(`${result.length} notes with title "${title}" in file`);
  return result.length;
};

module.exports.checkForFileContents = checkForFileContents;
module.exports.writeNote = writeNote;
module.exports.readNote = readNote;
module.exports.removeNote = removeNote;
module.exports.listNotes = listNotes;
module.exports.checkForNotesWithNeededTitle = checkForNotesWithNeededTitle;
