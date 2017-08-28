module.exports = (sequelize, DataTypes) => {
    const error = sequelize.define('error', {
        error: {
            type: DataTypes.STRING
        }
    });
    error.associate = (models) => {
        //no associations.
    };
    return error;
};
