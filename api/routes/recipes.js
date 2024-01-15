const express = require('express');

const router = express.Router();
const Recipe = require('../models').Recipe;
const User = require('../models').User;
const { authenticateUser } = require('../middleware/auth-user');
const { asyncHandler } = require('../middleware/async-handler');

// Return all recipes
router.get('/recipes', authenticateUser, asyncHandler(async (req, res) => {
  try {
    const user = req.currentUser;
    if (!user) {
      res.json({
        "error": "Sorry, you are not allowed to view recipes without signing in."
      });
    } else {
      let recipes = await Recipe.findAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        include: {
          model: User,
          attributes: {
            exclude: ['password', 'createdAt', 'updatedAt']
          }
        }
      });
      const usersRecipes = recipes.filter((recipe) => {
        return recipe.userId === user.id;
      });
      res.json(usersRecipes);
    }
  } catch (error) {
    console.log('ERROR: ', error.name);
  }
}));

// Return a specific recipe
router.get('/recipes/:id', asyncHandler(async (req, res) => {
  const recipe = await Recipe.findByPk(req.params.id, {
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    },
    include: {
      model: User,
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt']
      }
    }
  });
  if (recipe) {
    res.json(recipe);
  } else {
    res.json({
      "error": "Sorry, we couldn't find the recipe you were looking for."
    });
  }
}));

// Create a recipe
router.post('/recipes', authenticateUser, asyncHandler(async (req, res) => {
  try {
    const newRecipes = await Recipe.create(req.body);
    res.status(201)
      .location(`/recipe/${newRecipes.dataValues.id}`)
      .end();
  } catch (error) {
    console.log('ERROR: ', error.name);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      throw error;
    }
  }
}));

// Update an existing recipe
router.put("/recipes/:id", authenticateUser, asyncHandler(async (req, res, next) => {
  const user = req.currentUser;
  let recipe;
  try {
    recipe = await Recipe.findByPk(req.params.id);
    if (recipe) {
      if (recipe.userId === user.id) {
        await recipe.update(req.body);
        res.status(204).end();
      } else {
        res.status(403).json({ error: 'You are not authorised to update this recipe.' });
      }
    } else {
      const err = new Error(`Recipe Not Found`);
      res.status(404).json({ error: err.message });
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      throw error;
    }
  }
}));

// Delete an existing recipe
router.delete("/recipes/:id", authenticateUser, asyncHandler(async (req, res, next) => {
  const user = req.currentUser;
  const recipe = await Recipe.findByPk(req.params.id);
  if (recipe) {
    if (recipe.userId === user.id) {
      await recipe.destroy();
      res.status(204).end();
    } else {
      res.status(403).json({ error: 'You are not authorised to delete this recipe.' });
    }
  } else {
    const err = new Error(`Recipe Not Found`);
    res.status(404).json({ error: err.message });
  }
}));

module.exports = router;

