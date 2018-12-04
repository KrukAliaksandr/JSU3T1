/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
import * as myModule from 'D:/work/Javascript/jsu3t1/LocalModule.js'
const todo = require('yargs');
const fs = require('fs');
const XLSX = require('xlsx');


todo.command('Add', 'makes an action with a file', function (yargs) {
  return yargs.options({
    'path': {
      alias: 'p',
      describe: 'path to file',
      demandOption: true
    },
    'title': {
      alias: 't',
      describe: 'node title',
      demandOption: true
    },
    'body': {
      alias: 'b',
      describe: 'node body',
      demandOption: true
    }
  });
},
function (argv) {
  const jsonObject = require('./' + argv.path + '.json');
  try {
    const validFile = myModule.checkForFileContents(argv, jsonObject);
    if (myModule.checkForNotesWithNeededTitle(argv, validFile) === 0) {
      myModule.writeNote(argv, validFile);
    } else {
      throw new Error('Duplicates found! Please change the file');
    }
  } catch (err) {
    console.log(err.message);
  }
})
  .command('List', 'makes an action with a file', function (yargs) {
    return yargs.options({
      'path': {
        alias: 'p',
        describe: 'path to file',
        demandOption: true
      }
    });
  },
  function (argv) {
    try {
      const jsonObject = require('./' + argv.path + '.json');
      listNotes(argv, checkForFileContents(argv, jsonObject));
    } catch (err) {
      console.log(err.message);
    }
  }
  )
  .command('Read', 'makes an action with a file', function (yargs) {
    return yargs.options({
      'path': {
        alias: 'p',
        describe: 'path to file',
        demandOption: true
      },
      'title': {
        alias: 't',
        describe: 'node title',
        demandOption: true
      }
    });
  },
  function (argv) {
    try {
      const jsonObject = require('./' + argv.path + '.json');
      readNote(argv, checkForFileContents(argv, jsonObject));
    } catch (err) {
      console.log(err.message);
    }
  }
  )
  .command('Export', 'exports file to Excel', function (yargs) {
    return yargs.options({
      'path': {
        alias: 'p',
        describe: 'path to file',
        demandOption: true
      }
    });
  },
  function (argv) {
    try {
      const jsonObject = require('./' + argv.path + '.json');
      writeToExcel(argv, checkForFileContents(argv, jsonObject));
    } catch (err) {
      console.log(err.message);
    }
  }
  )
  .command('Import', 'imports file to Excel', function (yargs) {
    return yargs.options({
      'path': {
        alias: 'p',
        describe: 'path to file',
        demandOption: true
      }
    });
  },
  function (argv) {
    importFromExcel(argv);
  }
  )
  .command('Sort', 'Sort file', function (yargs) {
    return yargs.options({
      'path': {
        alias: 'p',
        describe: 'path to file',
        demandOption: true
      },
      'type': {
        alias: 't',
        describe: 'type of sort',
        choices: ['date', 'titleLength', 'bodyLength', 'alphabet'],
        demandOption: true
      },
      'order': {
        alias: 'o',
        describe: 'order of sort',
        choices: ['ascending', 'descending'],
        demandOption: true
      }
    });
  },
  function (argv) {
    try {
      const jsonObject = require('./' + argv.path + '.json');
      sortBy(argv, checkForFileContents(argv, jsonObject));
    } catch (err) {
      console.log(err.message);
    }
  }
  )
  .command('Update', 'makes an action with a file', function (yargs) {
    return yargs.options({
      'path': {
        alias: 'p',
        describe: 'path to file',
        demandOption: true
      },
      'title': {
        alias: 't',
        describe: 'node title',
        demandOption: true
      },
      'updateType': {
        alias: 'u',
        describe: 'property to update.Can be either title or body',
        choices: ['title', 'body'],
        demandOption: true
      },
      'value': {
        alias: 'v',
        describe: 'new vaule for update',
        demandOption: true
      }
    });
  },
  function (argv) {
    const jsonObject = require('./' + argv.path + '.json');
    try {
      const validFile = checkForFileContents(argv, jsonObject);
      switch (checkForNotesWithNeededTitle(argv, validFile)) {
        case 0:
          throw new Error('Notes with such title are not found');
        case 1:
          updateNote(argv, validFile);
          break;
        default:
          throw new Error('Duplicates found! Please change the file');
      }
    } catch (err) {
      console.log(err.message);
    }
  })
  .command('Remove', 'makes an action with a file', function (yargs) {
    return yargs.options({
      'path': {
        alias: 'p',
        describe: 'path to file',
        demandOption: true
      },
      'title': {
        alias: 't',
        describe: 'node title',
        demandOption: true
      }
    });
  },
  function (argv) {
    try {
      const jsonObject = require('./' + argv.path + '.json');
      removeNote(argv, checkForFileContents(argv, jsonObject));
    } catch (err) {
      console.log(err.message);
    }
  }
  )
  .help()
  .demandCommand(1, 'You need at least one command before moving on')
  .argv;

function checkForFileContents (args, requiredFile) {
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

function writeNote (args, requiredFile) {
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

function listNotes (args, requiredFile) {
  requiredFile.forEach(function (note) {
    console.log(note);
  });
}

function readNote (args, requiredFile) {
  const result = requiredFile.filter(function (note) {
    return note.title === args.title;
  });
  (result.length === 0) ? console.log('Nothing') : (console.log(result));
  return result[0];
}

function removeNote (args, requiredFile) {
  const result = requiredFile.filter((note) => note.title !== args.title);
  fs.writeFile(args.path + '.json', JSON.stringify(result, null, '\t'), 'utf8', () => {
    // eslint-disable-next-line no-console
    console.log(args.title + 'successfully Removed');
  });
}

function checkForNotesWithNeededTitle (args, file) {
  const result = file.filter(function (note) {
    return note.title === args.title;
  });
  console.log(result.length + ` notes with title "${args.title}" in file`);
  return result.length;
}

function updateNote (args, file) {
  const noteIndex = file.findIndex((note) => {
    return (note.title === args.title);
  });
  (args.updateType === 'title') ? (file[noteIndex].title = args.value) : (file[noteIndex].body = args.value);
  fs.writeFile(args.path + '.json', JSON.stringify(file, null, '\t'), 'utf8', () => {
    // eslint-disable-next-line no-console
    console.log(args.title + 'successfully Updated');
  });
}

function sortBy (args, file) {
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

function checkforNotesWithMissingBody (args, file) {
  const result = file.filter((note) => !('body' in note));
  result.forEach(note => {
    console.log(`note with ${note.title} + " is missing a body`);
  });
}

function compareByDate (a, b) {
  if (a.date < b.date) { return -1; }
  if (a.date > b.date) { return 1; }
  return 0;
}

function compareByTitleLength (a, b) {
  if (a.title.length < b.title.length) { return -1; }
  if (a.title.length > b.title.length) { return 1; }
  return 0;
}

function compareByBodyLength (a, b) {
  if (a.body.length < b.body.length) { return -1; }
  if (a.body.length > b.body.length) { return 1; }
  return 0;
}

function compareByAlphabeticalOrder (a, b) {
  if (a.localeCompare(b, 'en', { sensitivity: 'base' }) === -1) { return -1; }
  if (a.localeCompare(b, 'en', { sensitivity: 'base' }) === 1) { return 1; }
  return 0;
}

function writeToExcel (args, fileContents) {
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

function importFromExcel (args) {
  const workbook = XLSX.readFile(args.path + '.xlsx');
  const sheetNames = workbook.SheetNames;
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
  fs.writeFile(args.path + '.json', JSON.stringify(data, null, '\t'), 'utf8', () => {
    // eslint-disable-next-line no-console
    console.log(args.path + '.xlsx successfully Imported');
  });
}
