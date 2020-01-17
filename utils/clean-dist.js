const fs = require('fs-extra');

return fs.remove("./dist").catch(e => {
    console.error(e);
    process.exit(1)
});