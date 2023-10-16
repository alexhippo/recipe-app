import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import Header from './Components/Header';
import Recipes from './Components/Recipes/Recipes';
import RecipeDetail from './Components/Recipes/RecipeDetail';
import UpdateRecipe from './Components/Recipes/UpdateRecipe';
import UserSignIn from './Components/User/UserSignIn';
import UserSignUp from './Components/User/UserSignUp';
import UserSignOut from './Components/User/UserSignOut';
import CreateRecipe from './Components/Recipes/CreateRecipe';
import NotFound from './Components/Errors/NotFound';
import Forbidden from './Components/Errors/Forbidden';
import UnhandledError from './Components/Errors/UnhandledError';

import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <div id="root">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Navigate replace to="/recipes" />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/recipes/:id/update" element={<PrivateRoute />}>
            <Route path="/recipes/:id/update" element={<UpdateRecipe />} />
          </Route>
          <Route path="/signin" element={<UserSignIn />} />
          <Route path="/signup" element={<UserSignUp />} />
          <Route path="/signout" element={<UserSignOut />} />
          <Route path="/recipes/create" element={<PrivateRoute />}>
            <Route path="/recipes/create" element={<CreateRecipe />} />
          </Route>
          <Route path="/notfound" element={<NotFound />} />
          <Route path="/forbidden" element={<Forbidden />} />
          <Route path="/error" element={<UnhandledError />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
