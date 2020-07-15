import React from 'react'
import './Nav.css'

export default function nav() {
    let loggedIn = sessionStorage.getItem('loggedIn');
    let username = sessionStorage.getItem('username');
    if(loggedIn){
        return (
            <nav>
                <ul id='nav'>
                    <li><a href='/'>allRecipes</a></li>
                    <li>Hello {username}</li>
                    <li><a href='/account'>Favorites</a></li>
                </ul>
            </nav>
        )
    }
    else {
        return (
            <nav>
                <ul id='nav'>
                    <li><a href='/'>allRecipes</a></li>
                    <li><a href='/signup'>Sign Up</a></li>
                    <li><a href='/login'>Login</a></li>
                </ul>
            </nav>
        )
    }
    
}
