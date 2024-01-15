'use strict';

const bcryptjs = require('bcryptjs');
const Context = require('./context');

class Database {
  constructor(seedData, enableLogging) {
    this.recipes = seedData.recipes;
    this.users = seedData.users;
    this.enableLogging = enableLogging;
    this.context = new Context('fsjstd-restapi.db', enableLogging);
  }

  log(message) {
    if (this.enableLogging) {
      console.info(message);
    }
  }

  tableExists(tableName) {
    this.log(`Checking if the ${tableName} table exists...`);

    return this.context
      .retrieveValue(`
        SELECT EXISTS (
          SELECT 1 
          FROM sqlite_master 
          WHERE type = 'table' AND name = ?
        );
      `, tableName);
  }

  createUser(user) {
    return this.context
      .execute(`
        INSERT INTO Users
          (firstName, lastName, emailAddress, password, createdAt, updatedAt)
        VALUES
          (?, ?, ?, ?, datetime('now'), datetime('now'));
      `,
        user.firstName,
        user.lastName,
        user.emailAddress,
        user.password);
  }

  createRecipe(recipe) {
    return this.context
      .execute(`
        INSERT INTO Recipes
          (userId, title, method, estimatedTime, ingredients, numOfServings, otherNotes, originalRecipeLink, createdAt, updatedAt)
        VALUES
          (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'));
      `,
        recipe.userId,
        recipe.title,
        recipe.method,
        recipe.estimatedTime,
        recipe.ingredients,
        recipe.numOfServings,
        recipe.otherNotes,
        recipe.originalRecipeLink);
  }

  async hashUserPasswords(users) {
    const usersWithHashedPasswords = [];

    for (const user of users) {
      const hashedPassword = await bcryptjs.hash(user.password, 10);
      usersWithHashedPasswords.push({ ...user, password: hashedPassword });
    }

    return usersWithHashedPasswords;
  }

  async createUsers(users) {
    for (const user of users) {
      await this.createUser(user);
    }
  }

  async createRecipes(recipes) {
    for (const recipe of recipes) {
      await this.createRecipe(recipe);
    }
  }

  async init() {
    const oldCourseTableExists = await this.tableExists('Courses');
    if (oldCourseTableExists) {
      this.log('Dropping the old Courses table...');

      await this.context.execute(`
        DROP TABLE IF EXISTS Courses;
      `);
    }

    const oldRecipeTableExists = await this.tableExists('Recipes');
    if (oldRecipeTableExists) {
      this.log('Dropping the old Recipes table...');

      await this.context.execute(`
        DROP TABLE IF EXISTS Recipes;
      `);
    }

    const userTableExists = await this.tableExists('Users');

    if (userTableExists) {
      this.log('Dropping the Users table...');

      await this.context.execute(`
        DROP TABLE IF EXISTS Users;
      `);
    }

    this.log('Creating the Users table...');

    await this.context.execute(`
      CREATE TABLE Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        firstName VARCHAR(255) NOT NULL DEFAULT '', 
        lastName VARCHAR(255) NOT NULL DEFAULT '', 
        emailAddress VARCHAR(255) NOT NULL DEFAULT '' UNIQUE, 
        password VARCHAR(255) NOT NULL DEFAULT '', 
        createdAt DATETIME NOT NULL, 
        updatedAt DATETIME NOT NULL
      );
    `);

    this.log('Hashing the user passwords...');

    const users = await this.hashUserPasswords(this.users);

    this.log('Creating the user records...');

    await this.createUsers(users);

    const recipeTableExists = await this.tableExists('Recipes');

    if (recipeTableExists) {
      this.log('Dropping the Recipes table...');

      await this.context.execute(`
        DROP TABLE IF EXISTS Recipes;
      `);
    }

    this.log('Creating the Recipes table...');

    await this.context.execute(`
      CREATE TABLE Recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        title VARCHAR(255) NOT NULL DEFAULT '', 
        method TEXT NOT NULL DEFAULT '', 
        estimatedTime VARCHAR(255), 
        ingredients VARCHAR(255),
        numOfServings VARCHAR(255),
        otherNotes TEXT, 
        originalRecipeLink VARCHAR(255),
        createdAt DATETIME NOT NULL, 
        updatedAt DATETIME NOT NULL, 
        userId INTEGER NOT NULL DEFAULT -1 
          REFERENCES Users (id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    this.log('Creating the recipe records...');

    await this.createRecipes(this.recipes);

    this.log('Database successfully initialized!');
  }
}

module.exports = Database;
