import React, { Component} from 'react';
import { createPortal } from 'react-dom';

// Declare a class, with properties and able to remember its state

class SearchBar extends Component{ // The class SearchBar inherits all the properties of "React.Component"
    // Default function that renders component in JSX
    // Constructor called automatically
    constructor(props){ 
        super(props); // Calls the props from the parent class, Component
        this.state = {term : ""}; // Initial state in this manner
    }

    render() {
        // This is how you change the state, using setState
        return (<div className = "search-bar"> 
            
            <input 
            value = {this.state.term}
            onChange = {event => this.onInputChange(event.target.value)}/> 

            </div>);
    }

    onInputChange(term){
        this.setState({term});
        this.props.onSearchTermChange(term);
    }
}

export default SearchBar;