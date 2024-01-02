import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Context from '../../Context';
import Loading from '../Loading';

const Recipes = () => {
  const context = useContext(Context.Context);
  let [recipes] = useState('');
  const [data, setData] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  let navigate = useNavigate();

  useEffect(() => {
    context.data.getRecipes()
      .then((response) => {
        setData(response);
      })
      .catch((error) => {
        console.error('Error fetching and parsing data', error);
        navigate('/error');
      })
      .finally(() => setIsLoading(false));
  }, [navigate, context.data]);

  if (data.length) {
    recipes = data.map((recipe) => {
      return <Link to={`/recipes/${recipe.id}`} className="recipe--module recipe--link" key={recipe.id}>
        <h2 className="recipe--label">Recipe</h2>
        <h3 className="recipe--title">{recipe.title}</h3>
      </Link>
    });
  }

  return (
    isLoading ?
      <Loading />
      : <div className="wrap main--grid">
        {recipes}
        <Link to='/recipes/create' className="recipe--module recipe--add--module">
          <span className="recipe--add--title">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
              viewBox="0 0 13 13" className="add"><polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon></svg>
            New Recipe
          </span>
        </Link>
      </div>
  );
}

export default Recipes;
