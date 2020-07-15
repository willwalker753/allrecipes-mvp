import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './Recipe.css'
import Nav from './Nav'
import axios from 'axios'

let array = [];
const apiKey = '01673e987d334c68ba50b7b73c675d42';

export default class Recipe extends Component {
    constructor(props) {
        super(props);
        this.state = {
          error: null,
          isLoaded: false,
          items: []
        };
    }
    addToFav() {
      console.log('clicked');
      let userId = window.sessionStorage.getItem('userID');
      console.log(userId);
      if(userId === null){
        alert('You must be signed in to add to favorites');
      }
      else {
        let recipeId = window.location.href;
        recipeId = recipeId.replace('https://allrecipes-mvp.vercel.app/recipe/','');
        let json = {
          'userId': userId,
          'recipeId': recipeId
        };
        axios.post('https://allrecipes-api.herokuapp.com/favorite', json)
          .then(response => {
            console.log(response)
            alert('Added to Favorites');
        })
      }
      
    }
    componentDidMount() {
        let recipeId = window.location.href;
        recipeId = recipeId.replace('https://allrecipes-mvp.vercel.app/recipe/','');
        console.log(recipeId);
        let url = 'https://api.spoonacular.com/recipes/'+recipeId+'/information?apiKey='+apiKey;
        fetch(url)
          .then(res => res.json())
          .then(
            (result) => {
              this.setState({
                isLoaded: true,
                items: result
              });
            },
            (error) => {
              this.setState({
                isLoaded: true,
                error
              });
            }
          )
        }
    render() {
        const { error, isLoaded, items } = this.state;
        if (error) {
          return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
          return <div>Loading...</div>;
        } else {
            array = this.state.items;
            console.log(array);
            }
        return (
            <div>
                <Nav />
                <h2>{array.title}</h2>
                <button value='Add to Favorites' onClick={this.addToFav}>Add to Favorites</button>
                <img src={array.image} alt='recipe'/>
                <h4>Ingredients:</h4>
                <ul>
                    {array.extendedIngredients.map(item => (
                            <li>{item.measures.us.amount} {item.measures.us.unitShort} {item.name}</li>
                    ))}
                </ul>
                <p>{array.instructions}</p>
            </div>
        )
    }
}
