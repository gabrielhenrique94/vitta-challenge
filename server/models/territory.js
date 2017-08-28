module.exports = (sequelize, DataTypes) => {
    const territory = sequelize.define('territory', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        start_x: {
            type: DataTypes.INTEGER,
        },
        start_y: {
            type: DataTypes.INTEGER,
        },
        end_x: {
            type: DataTypes.INTEGER,
        },
        end_y: {
            type: DataTypes.INTEGER,
        },
        painted_area: {
            type: DataTypes.INTEGER,
        }

    });
    territory.associate = (models) => {
        models.territory.hasMany(models.square)
    };
    return territory;
};
