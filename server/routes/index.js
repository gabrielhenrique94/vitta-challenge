"use strict";

module.exports = (app) => {
    app.use('/territories', require('./territory').router);
    app.use('/squares', require('./squares').router);
    app.use('/dashboard', require('./dashboard').router);
};
