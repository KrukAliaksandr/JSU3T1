const fs = require('fs');

const updateNote = function updateNote (args, file) {
  const noteIndex = file.findIndex((note) => {
    return (note.title === args.title);
  });
  (args.updateType === 'title') ? (file[noteIndex].title = args.value) : (file[noteIndex].body = args.value);
  fs.writeFile(args.path + '.json', JSON.stringify(file, null, '\t'), 'utf8', () => {
    // eslint-disable-next-line no-console
    console.log(args.title + 'successfully Updated');
  });
};

const sortBy = function sortBy (args, file) {
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
};

const compareByDate = function compareByDate (a, b) {
  if (a.date < b.date) { return -1; }
  if (a.date > b.date) { return 1; }
  return 0;
};

const compareByTitleLength = function compareByTitleLength (a, b) {
  if (a.title.length < b.title.length) { return -1; }
  if (a.title.length > b.title.length) { return 1; }
  return 0;
};

const compareByBodyLength = function compareByBodyLength (a, b) {
  if (a.body.length < b.body.length) { return -1; }
  if (a.body.length > b.body.length) { return 1; }
  return 0;
};

const compareByAlphabeticalOrder = function compareByAlphabeticalOrder (a, b) {
  if (a.localeCompare(b, 'en', { sensitivity: 'base' }) === -1) { return -1; }
  if (a.localeCompare(b, 'en', { sensitivity: 'base' }) === 1) { return 1; }
  return 0;
};

module.exports.compareByAlphabeticalOrder = compareByAlphabeticalOrder;
module.exports.compareByBodyLength = compareByBodyLength;
module.exports.compareByTitleLength = compareByTitleLength;
module.exports.compareByDate = compareByDate;
module.exports.updateNote = updateNote;
module.exports.sortBy = sortBy;
