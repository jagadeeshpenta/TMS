var { readFile, writeFile, rename } = require('fs');
var { join } = require('path');
var rootPath = join(__dirname, '..', 'dist');

var filesToRename = [
    'inline.bundle',
    'polyfills.bundle',
    'scripts.bundle',
    'styles.bundle',
    'vendor.bundle',
    'main.bundle'
];
var replaceFileContent,
    versionNo = (new Date).getTime();

var renamePromises = [];
filesToRename.forEach((fs) => {
    renamePromises.push(new Promise((res, rej) => {
        var oldPath = join(rootPath, fs + '.js');
        var newPath = join(rootPath, `${fs}-${versionNo}.js`);
        rename(oldPath, newPath, (err) => {
            if (err) {
                rej({});
            } else {
                res({});
            }
        });
    }));
});

var readIndex = () => {
    return new Promise((res, rej) => {
        readFile(join(rootPath, 'index.html'), (err, data) => {
            if (!err) {
                var fileContent = data.toString();
                filesToRename.forEach((s) => {
                    fileContent = fileContent.replace(`${s}.js`, `${s}-${versionNo}.js`);
                });
                replaceFileContent = fileContent;
                res({ content: replaceFileContent });
            } else {
                res({ err });
            }
        });
    });
};

var writeIndex = (fileContent) => {
    return new Promise((res, rej) => {
        writeFile(join(rootPath, 'index.html'), fileContent, (err) => {
            if (err) {
                rej({ err });
            } else {
                res({});
            }
        });
    });
};

Promise.all(renamePromises).then(() => {
    readIndex().then(({ err, content }) => {
        if (!err && content) {
            writeIndex(content);
        }
    }, (err) => {
        console.log('err');
    });
});



