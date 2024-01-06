const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Recipe extends Model { }
  Recipe.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A title for the recipe is required.'
        },
        notEmpty: {
          msg: 'Please provide a title for the recipe.'
        }
      }
    },
    method: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A recipe method is required.'
        },
        notEmpty: {
          msg: 'Please provide a method.'
        }
      }
    },
    estimatedTime: {
      type: DataTypes.STRING
    },
    numOfServings: {
      type: DataTypes.INTEGER
    },
    ingredients: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Ingredients are required.'
        },
        notEmpty: {
          msg: 'Please provide ingredients.'
        }
      }
    },
    otherNotes: {
      type: DataTypes.TEXT,
    },
    originalRecipeLink: {
      type: DataTypes.STRING,
    },
  }, { sequelize });

  Recipe.associate = (models) => {
    Recipe.belongsTo(models.User, {
      foreignKey: {
        fieldName: 'userid',
      }
    });
  }

  return Recipe;
}