"use strict";

module.exports = (app) => {
    app.use('/territories', require('./territory').router);
    app.use('/squares', require('./squares').router);
};
