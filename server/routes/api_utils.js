"use strict";

module.exports = {
    send_error: (res, status, message) => {
        let error = {
            error: true,
            data: message
        };
        res.status(status).send(error);
    },

    errors: {
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        NOT_FOUND: 404,
        INTERNAL_SERVER_ERROR: 500
    }
};