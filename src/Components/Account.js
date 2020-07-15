import React, { Component } from 'react';
import Nav from './Nav';
import axios from 'axios';

let array = [];
let recipeArray = [];
let ran = false;

export default class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
          error: null,
          isLoaded: false,
          items: []
        };
    }
    makeIdArray() {
        if(!ran){
            for(let i=0;i<array.length;i++) {
                array[i] = Object.values(array[i]);
                array[i] = array[i][2];
            }
        }
        ran = true;
        return array;
    }
    async deleteFavorite(recipeId) {
        let userId = window.sessionStorage.getItem('userID');
        let json = {
            'userId': userId,
            'recipeId': recipeId
        }; 
        await axios.post('https://allrecipes-api.herokuapp.com/favorite/delete', json)
            .then(response => {
                if(response){
                    window.location.reload(false);
                }
            },
            (error) => {
                this.setState({
                    error
                });
            }
            )
    }
    async getRecipeInfo() {
        console.log('made it inside get recipe info');
        let param = '';
        for(let i=0;i<array.length;i++) {
            if(i===0){
                param = array[i];
            }
            else {
                param = param + ',' + array[i];
            }
        }
        console.log(param);
        let url = 'https://api.spoonacular.com/recipes/informationBulk?ids=' + param + '&apiKey=7422ef4ed19a4d60954f75383db15c1f';
        console.log(url);
        await axios.get(url)
            .then(response => {         
                recipeArray = response.data;
                recipeArray.map(item => {
                    item.sourceUrl = 'https://allrecipes-mvp.vercel.app/recipe/'+item.id;
                })
                console.log(recipeArray);
                return recipeArray
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                    });
            });   
            this.setState({
                isLoaded: true,  
            });              
    }
    async componentDidMount() {
        let userId = window.sessionStorage.getItem('userID');
        let json = {
            'userId': userId,
        }; 
        await axios.post('https://allrecipes-api.herokuapp.com/favorite/get', json)
          .then(response => {
              this.setState({
                items: response.data,   
              });
              

            },
            (error) => {
              this.setState({
                isLoaded: true,
                error
              });
            }
          )
        array = this.state.items;
        this.makeIdArray()
        this.getRecipeInfo()
        console.log(array);
        if(array.length == 0){
            alert('You do not have any recipes in your favorites');
            window.location.replace('https://allrecipes-mvp.vercel.app/');
        }
    }

    render() {
        const { error, isLoaded, items } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } 
        else if (!isLoaded) {
            return <div>Loading...</div>;
        } 
        return (
        <div>
            <Nav />
            {recipeArray.map(item => (
                <div key={item.id}>
                    <h3><a href={item.sourceUrl} target='_blank'>{item.title}</a></h3>
                    <img src={item.image} alt='recipe'/>
                    <button onClick={() => this.deleteFavorite(item.id)}>Remove</button>
                </div>
            ))}
        </div>
        ) 
    }
}

