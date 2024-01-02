import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Context from '../../Context';
import Loading from '../Loading';

const RecipeDetail = () => {
  const context = useContext(Context.Context);
  let recipeDetail = useState('');
  const [recipe, setRecipeDetail] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const authUser = context.authenticatedUser;

  const { id } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    // Fetch a recipe from the database
    const controller = new AbortController();
    context.data.getRecipe(id)
      .then((response) => {
        if (response.id) {
          setRecipeDetail(response)
        } else {
          // If there is no recipe ID, direct to Not Found
          navigate('/notfound');
        }
      })
      .catch((error) => {
        console.error('Error fetching and parsing recipe', error);
        navigate('/error');
      })
      .finally(() => {
        setIsLoading(false);
      });
    // Clean up to prevent memory leak
    return () => controller?.abort();
  }, [id, navigate, context.data]);

  if (recipe.id) {
    recipeDetail = <div className="wrap">
      <h2>Recipe Detail</h2>
      <div className="main--flex">
        <div>
          <h3 className="recipe--detail--title">Recipe</h3>
          <h4 className="recipe--name">{recipe.title}</h4>
          {recipe.User
            ? (<p>By {recipe.User.firstName} {recipe.User.lastName}</p>)
            : null
          }
          <h3 className="recipe--detail--title">Method</h3>
          <ReactMarkdown>{recipe.method}</ReactMarkdown>
          {recipe.otherNotes && (
            <><h3 className="recipe--detail--title">Other Notes</h3><ReactMarkdown>{recipe.otherNotes}</ReactMarkdown></>
          )}
        </div>
        <div>
          {recipe.estimatedTime && (
            <><h3 className="recipe--detail--title">Estimated Time</h3><p>{recipe.estimatedTime}</p></>
          )}

          {recipe.numOfServings && (
            <><h3 className="recipe--detail--title">Number of Servings</h3><p>{recipe.numOfServings}</p></>
          )}

          <h3 className="recipe--detail--title">Ingredients</h3>
          <ul className="recipe--detail--list">
            <ReactMarkdown>{recipe.ingredients}</ReactMarkdown>
          </ul>

          <h3 className="recipe--detail--title">Original Recipe Link</h3>
          <p><a href={recipe.originalRecipeLink}>{recipe.originalRecipeLink}</a></p>
        </div>
      </div>
    </div >
  }

  const handleDelete = (event) => {
    event.preventDefault();
    context.data.deleteRecipe(id, authUser.emailAddress, authUser.password)
      .then((response) => {
        // If recipe deletion is successful, then there should be no response returned
        if (response.length) {
          navigate('/error');
        } else {
          navigate('/');
        }
      })
      .catch((error) => {
        console.error(error);
        navigate('/error');
      });
  }

  return (
    isLoading ?
      <Loading />
      : recipe ? <div>
        <div className="actions--bar">
          <div className="wrap">
            {authUser && (authUser.id === recipe.User.id) ?
              <Link to={`/recipes/${id}/update`} className="button">Update Recipe</Link>
              : null
            }
            {authUser && (authUser.id === recipe.User.id) ?
              <button className="button" onClick={handleDelete}>Delete Recipe</button>
              : null
            }
            <Link to='/' className="button button-secondary">Return to List</Link>
          </div>
        </div>
        {recipeDetail}
      </div>
        : null
  )
}

export default RecipeDetail;
