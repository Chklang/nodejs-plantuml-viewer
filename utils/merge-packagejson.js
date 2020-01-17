const fs = require('fs-extra');

fs.readFile('./package.json').then((contentAppBuffered) => {
    const contentApp = JSON.parse(contentAppBuffered.toString());
    delete contentApp.devDependencies;

    return fs.writeFile('./dist/package.json', JSON.stringify(contentApp, null, 4));
});