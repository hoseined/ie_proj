import React from 'react';

import classes from './Role.module.css';
import {withRouter} from 'react-router-dom'
const role = (props) => {
    console.log(props)
    const clicked = () =>{
        console.log("hooy")
        props.history.push(props.title.split(' ').join('').toLowerCase())
    }
    return(
    <section className={classes.Role} onClick={clicked}>
        <h1>{props.title}</h1>
    </section>
    )
};

export default withRouter(role);