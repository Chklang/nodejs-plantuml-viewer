const fs = require('fs-extra');

return fs.remove("./.tmp").catch(e => {
    console.error(e);
    process.exit(1)
});