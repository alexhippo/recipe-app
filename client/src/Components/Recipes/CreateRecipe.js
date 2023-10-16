import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Context from '../../Context';

const CreateRecipe = () => {
  const context = useContext(Context.Context);
  const [recipeTitle, setRecipeTitle] = useState('');
  const [recipeMethod, setRecipeMethod] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [numOfServings, setNumOfServings] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [otherNotes, setOtherNotes] = useState('');
  const [originalRecipeLink, setOriginalRecipeLink] = useState('');
  const [errors, setErrors] = useState([]);
  const authUser = context.authenticatedUser;

  let navigate = useNavigate();

  const onChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === 'recipeTitle') {
      setRecipeTitle(value);
    }

    if (name === 'recipeMethod') {
      setRecipeMethod(value);
    }

    if (name === 'estimatedTime') {
      setEstimatedTime(value);
    }

    if (name === 'numOfServings') {
      setNumOfServings(value);
    }

    if (name === 'ingredients') {
      setIngredients(value);
    }

    if (name === 'otherNotes') {
      setOtherNotes(value);
    }

    if (name === 'originalRecipeLink') {
      setOriginalRecipeLink(value);
    }

  }

  const submit = (event) => {
    event.preventDefault();
    // Recipe object to create a recipe
    const recipe = {
      title: recipeTitle,
      method: recipeMethod,
      estimatedTime: estimatedTime,
      numOfServings: numOfServings,
      ingredients: ingredients,
      otherNotes: otherNotes,
      originalRecipeLink: originalRecipeLink,
      userId: authUser.id,
    };

    context.data.createRecipe(recipe, authUser.emailAddress, authUser.password)
      .then(errors => {
        if (errors.length) {
          setErrors(errors);
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
    <div className="wrap">
      <h2>Create Recipe</h2>
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
            <label htmlFor="recipeTitle">Recipe Title</label>
            <input id="recipeTitle" name="recipeTitle" type="text" value={recipeTitle} onChange={onChange} />

            {/* Use current authenticated user's first name and last name as course author */}
            <p>By {authUser.firstName} {authUser.lastName}</p>

            <label htmlFor="recipeMethod">Recipe Method</label>
            <textarea id="recipeMethod" name="recipeMethod" value={recipeMethod} onChange={onChange}></textarea>

            <label htmlFor="otherNotes">Other notes</label>
            <textarea id="otherNotes" name="otherNotes" value={otherNotes} onChange={onChange}></textarea>
          </div>
          <div>
            <label htmlFor="estimatedTime">Estimated Time</label>
            <input id="estimatedTime" name="estimatedTime" type="text" value={estimatedTime} onChange={onChange} />

            <label htmlFor="numOfServings">Serves</label>
            <input id="numOfServings" name="numOfServings" type="text" value={numOfServings} onChange={onChange} />

            <label htmlFor="ingredients">Ingredients</label>
            <textarea id="ingredients" name="ingredients" type="text" value={ingredients} onChange={onChange} />

            <label htmlFor="originalRecipeLink">Original recipe link</label>
            <input id="originalRecipeLink" name="originalRecipeLink" type="text" value={originalRecipeLink} onChange={onChange} />
          </div>
        </div>
        <button className="button" type="submit" onClick={submit}>Create Recipe</button>
        <button className="button button-secondary" onClick={cancel}>Cancel</button>
      </form>
    </div >

  );
}

export default CreateRecipe;
