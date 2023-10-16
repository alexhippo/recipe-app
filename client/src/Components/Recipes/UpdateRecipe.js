import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Context from '../../Context';
import Loading from '../Loading';

const UpdateCourse = () => {
  const context = useContext(Context.Context);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setRecipeTitle] = useState('');
  const [recipeUserFirstName, setRecipeUserFirstName] = useState('');
  const [recipeUserLastName, setRecipeUserLastName] = useState('');
  const [method, setRecipeMethod] = useState('');
  const [otherNotes, setOtherNotes] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [numOfServings, setNumOfServings] = useState('');
  const [originalRecipeLink, setOriginalRecipeLink] = useState('');
  const [errors, setErrors] = useState([]);
  const authUser = context.authenticatedUser;

  const { id } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    context.data.getRecipe(id)
      .then((response) => {
        if (response.error === "Sorry, we couldn't find the recipe you were looking for.") {
          navigate('/notfound');
        } else {
          // If the currently authenticated user is the same as the Recipe author
          // Allow the user to update the Recipe
          if (authUser.id === response.User.id) {
            setRecipeTitle(response.title);
            setRecipeMethod(response.method);
            setRecipeUserFirstName(response.User.firstName);
            setRecipeUserLastName(response.User.lastName);
            setNumOfServings(response.numOfServings);
            setEstimatedTime(response.estimatedTime);
            setIngredients(response.ingredients);
            setOtherNotes(response.otherNotes);
            setOriginalRecipeLink(response.originalRecipeLink);
          } else {
            navigate('/forbidden');
          }
        }
      })
      .catch(error => {
        console.error('Error fetching and parsing data', error);
        navigate('/error');
      })
      .finally(() => {
        setIsLoading(false);
      });
    // Clean up to prevent memory leak
    return () => controller?.abort();
  }, [authUser.id, id, navigate, context.data]);

  const onChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === 'title') {
      setRecipeTitle(value);
    }

    if (name === 'method') {
      setRecipeMethod(value);
    }

    if (name === 'otherNotes') {
      setOtherNotes(value);
    }

    if (name === 'numOfServings') {
      setNumOfServings(value);
    }

    if (name === 'estimatedTime') {
      setEstimatedTime(value);
    }

    if (name === 'ingredients') {
      setIngredients(value);
    }

    if (name === 'originalRecipeLink') {
      setOriginalRecipeLink(value);
    }
  }

  const submit = (event) => {
    event.preventDefault();
    // Recipe object to update the recipe
    const recipe = {
      title,
      method,
      estimatedTime,
      ingredients,
      numOfServings,
      otherNotes,
      originalRecipeLink,
      userId: authUser.id,
    };

    context.data.updateRecipe(id, recipe, authUser.emailAddress, authUser.password)
      .then((response) => {
        if (response.length) {
          setErrors(response);
        } else {
          navigate('/');
        }
      })
      .catch((error) => {
        console.error(error);
        navigate('/error');
      });
  }

  const cancel = (event) => {
    event.preventDefault();
    navigate('/');
  }

  return (
    isLoading ?
      <Loading />
      : <div className="wrap">
        <h2>Update Recipe</h2>
        {errors.length ?
          <div className="validation--errors">
            <h3>Validation Errors</h3>
            <ul>
              {errors.map((error, i) => <li key={i}>{error}</li>)}
            </ul>
          </div>
          : null
        }
        <form>
          <div className="main--flex">
            <div>
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" value={title} onChange={onChange} />

              <p>By {recipeUserFirstName} {recipeUserLastName}</p>

              <label htmlFor="method">Method</label>
              <textarea id="method" name="method" value={method} onChange={onChange}></textarea>

              <label htmlFor="otherNotes">Other Notes</label>
              <textarea id="otherNotes" name="otherNotes" value={otherNotes} onChange={onChange}></textarea>
            </div>
            <div>
              <label htmlFor="estimatedTime">Estimated Time</label>
              <input id="estimatedTime" name="estimatedTime" type="text" value={estimatedTime} onChange={onChange} />

              <label htmlFor="numOfServings">Number of Servings</label>
              <input id="numOfServings" name="numOfServings" type="text" value={numOfServings} onChange={onChange} />

              <label htmlFor="ingredients">Ingredients</label>
              <textarea id="ingredients" name="ingredients" value={ingredients} onChange={onChange}></textarea>

              <label htmlFor="originalRecipeLink">Original recipe link</label>
              <input id="originalRecipeLink" name="originalRecipeLink" type="text" value={originalRecipeLink} onChange={onChange} />
            </div>
          </div>
          <button className="button" type="submit" onClick={submit}>Update Recipe</button>
          <button className="button button-secondary" onClick={cancel}>Cancel</button>
        </form>
      </div>
  )
}

export default UpdateCourse;