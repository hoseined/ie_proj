import React from 'react';

import classes from './SearchInput.module.css';

const SearchInput = ( props ) => {
    let inputElement=[] ;
    let temp;
    let scase = props.elementType;
    switch ( scase.toLowerCase() ) {
        case ( 'date' ):
            temp = <input  
                type = "date"
                key = {props.elementTitle}
                className={classes.InputElement} 
                value={props.value}
                onClick={props.clicked}
                onChange={props.changed} />;
            inputElement.push(temp);
            temp = <input
                type = "date"
                key = {props.elementTitle+"2"}
                className={classes.InputElement} 
                value={props.value2}
                onClick={props.clicked}
                onChange={props.changed2}
            />
            inputElement.push(temp);
            break;
        case ( 'num' ):
            temp = <input  
                type = "input"
                key = {props.elementTitle}
                className={classes.InputElement} 
                placeholder = {props.elementTitle +" min"}
                value={props.value}
                onClick={props.clicked}
                onChange={props.changed} />;
            inputElement.push(temp);
            temp = <input
                type = "input"
                key = {props.elementTitle+"2"}
                className={classes.InputElement} 
                placeholder = {props.elementTitle+" max"}
                value={props.value2}
                onClick={props.clicked}
                onChange={props.changed2}
            />
            inputElement.push(temp);
            console.log(props)
            break;
        case ( 'text' ):
            inputElement = <input
            className={classes.InputElement}
            placeholder = {props.elementTitle}
            value={props.value}
            onClick={props.clicked}
            onChange={props.changed} />;
            break;
        
    }

    return (
        <div className={classes.Input}>
            {inputElement}
        </div>
    );

};


export default SearchInput;