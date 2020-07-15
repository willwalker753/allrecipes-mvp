import React, { Component } from 'react';
import Nav from './Nav';
import './Results.css';
import axios from 'axios'

const apiKey = '01673e987d334c68ba50b7b73c675d42';
let count = 0;
let array = [];
export default class Results extends Component {
    constructor(props) {
        super(props);
        this.state = {
          error: null,
          isLoaded: false,
          items: []
        };
    }
    
    renderImage(){
      let imgUrl = `<img src='https://spoonacular.com/recipeImages/${this.state.items[count].image}-312x150.jpg' />`;
      count++;
      return (imgUrl)
    }


    componentDidMount() {
      let search = localStorage.getItem('search');
      let url = 'https://api.spoonacular.com/recipes/search?apiKey=' + apiKey + '&query=' + search;
      fetch(url)
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              isLoaded: true,
              items: result.results
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
            if(array.length === 0){
              console.log('nopenopenope');
              return <p>Your search did not return any results...<a href='/'>Back to home?</a></p>           
            }
            for(let i=0;i<10;i++){
                array[i].image = 'https://spoonacular.com/recipeImages/'+array[i].id+'-312x150.jpg';
                array[i].sourceUrl = 'https://allrecipes-mvp.vercel.app/recipe/'+array[i].id;
            }

          return (
            <div>
                <Nav />
              {array.map(item => (
                <div key={item.id}>
                    <a href={item.sourceUrl} target='_blank'>{item.title}</a>
                    <p>Ready in {item.readyInMinutes} minutes and serves {item.servings} people</p>
                    <img src={item.image} alt='picture of recipe'/><br/><br/>
                </div>
              ))}
            
            </div>
          );
        }
      }
}
