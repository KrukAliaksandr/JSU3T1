/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
const todo = require('yargs');
const mainFunctions = require('./mainFunctions');
const advancedFunctions = require('./advancedFunctions');
const fileFunctions = require('./fileFunctions');

todo.command('Add', 'Adds the specified note to the file', function (yargs) {
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
  const jsonObject = fileFunctions.checkForFileExistense(argv.path, 'json');
  try {
    const validFile = mainFunctions.checkForFileContents(argv, jsonObject);
    if (mainFunctions.checkForNotesWithNeededTitle(argv.title, validFile) === 0) {
      mainFunctions.writeNote(argv, validFile);
    } else {
      throw new Error('Duplicates found! Please change the file');
    }
  } catch (err) {
    console.log(err.message);
  }
})
  .command('List', 'Lists file notes', function (yargs) {
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
      const jsonObject = fileFunctions.checkForFileExistense(argv.path, 'json');
      mainFunctions.listNotes(argv, mainFunctions.checkForFileContents(argv, jsonObject));
    } catch (err) {
      console.log(err.message);
    }
  }
  )
  .command('Read', 'Reads specified file note', function (yargs) {
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
      const jsonObject = fileFunctions.checkForFileExistense(argv.path, 'json');
      mainFunctions.readNote(argv, mainFunctions.checkForFileContents(argv, jsonObject));
    } catch (err) {
      console.log(err.message);
    }
  }
  )
  .command('Export', 'Exports file to Excel', function (yargs) {
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
      const jsonObject = fileFunctions.checkForFileExistense(argv.path, 'json');
      fileFunctions.writeToExcel(argv, mainFunctions.checkForFileContents(argv, jsonObject));
    } catch (err) {
      console.log(err.message);
    }
  }
  )
  .command('Import', 'Imports file to Excel', function (yargs) {
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
      const jsonObject = fileFunctions.checkForFileExistense(argv.path, 'json');
      advancedFunctions.sortBy(argv, mainFunctions.checkForFileContents(argv, jsonObject));
    } catch (err) {
      console.log(err.message);
    }
  }
  )
  .command('Update', 'Updates either note title or note body', function (yargs) {
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
    const jsonObject = fileFunctions.checkForFileExistense(argv.path, 'json');
    try {
      const validFile = mainFunctions.checkForFileContents(argv, jsonObject);
      switch (mainFunctions.checkForNotesWithNeededTitle(argv.title, validFile)) {
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
  .command('Remove', 'Removes note from file', function (yargs) {
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
      const jsonObject = fileFunctions.checkForFileExistense(argv.path, 'json');
      mainFunctions.removeNote(argv, mainFunctions.checkForFileContents(argv, jsonObject));
    } catch (err) {
      console.log(err.message);
    }
  }
  )
  .help()
  .demandCommand(1, 'You need at least one command before moving on')
  .argv;
