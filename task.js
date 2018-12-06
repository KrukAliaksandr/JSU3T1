/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
const todo = require('yargs');
const fs = require('fs');
const XLSX = require('xlsx');
const mainFunctions = require('./mainFunctions');
const advancedFunctions = require('./advancedFunctions');
const fileFunctions = require('fileFunctions');

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
  const jsonObject = JSON.parse(fs.readFileSync('./' + argv.path + '.json', 'utf8'));
  try {
    const validFile = mainFunctions.checkForFileContents(argv, jsonObject);
    if (mainFunctions.checkForNotesWithNeededTitle(argv, validFile) === 0) {
      mainFunctions.writeNote(argv, validFile);
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
      mainFunctions.listNotes(argv, mainFunctions.checkForFileContents(argv, jsonObject));
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
      mainFunctions.readNote(argv, mainFunctions.checkForFileContents(argv, jsonObject));
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
      fileFunctions.writeToExcel(argv, mainFunctions.checkForFileContents(argv, jsonObject));
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
    fileFunctions.importFromExcel(argv);
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
      advancedFunctions.sortBy(argv, mainFunctions.checkForFileContents(argv, jsonObject));
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
      const validFile = mainFunctions.checkForFileContents(argv, jsonObject);
      switch (mainFunctions.checkForNotesWithNeededTitle(argv, validFile)) {
        case 0:
          throw new Error('Notes with such title are not found');
        case 1:
          advancedFunctions.updateNote(argv, validFile);
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
      mainFunctions.removeNote(argv, mainFunctions.checkForFileContents(argv, jsonObject));
    } catch (err) {
      console.log(err.message);
    }
  }
  )
  .help()
  .demandCommand(1, 'You need at least one command before moving on')
  .argv;
