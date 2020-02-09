import React, { Component } from 'react';

import Input from '../../components/UI/Input/Input';
import classes from './Login.module.css';
import Spinner from '../../components/UI/Spinner/Spinner';
import axios from 'axios'
import {withRouter} from 'react-router-dom'
class Login extends Component {
    state = {
        fields: {
            username: {
                elementType: 'input',
                elementTitle: 'username',
                value: '',
                validation: {
                    required: true,
                    isName: true
                },
                valid: false,
                touched: false,
                messages :[]
            },
            password: {
                elementType: 'password',
                elementTitle: 'password',
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false,
                messages :[]
            }
        },
        formIsValid :false,
        loading:false
    }

    checkValidity(value, rules) {
        let message = []
        let isValid = true;
        if (!rules) {
            return [true,[]];
        }
        if (rules.required) {
            //console.log()
            isValid = value.trim() !== '' && isValid;
            if(!isValid)
                message.push('value of this field can\'t be empty');
        }
         if(rules.isName && value.trim()!==''){
            const pattern = /^[A-Za-z]+([ A-Za-z]+)*$/;
           // console.log("ojnu")
            isValid = pattern.test(value) && isValid
            if(!isValid)
                message.push('please insert a valid Name');
         }

        if (rules.isEmail && value.trim()!=='') {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test(value) && isValid
            if(!isValid)
                message.push('please insert a valid Email address');
        }

        if (rules.isAge && value.trim()!=='') {
            const pattern = /^\d{2}$/;
            isValid = pattern.test(value) && isValid
            if(!isValid)
                message.push('please insert a valid Age(age must be between [10,99])');
        }
        if (rules.minLength && value.trim()!=='') {
            isValid = value.length >= rules.minLength && isValid
            if(!isValid)
                message.push(`your password must be at least ${rules.minLength} characters long `);
        }
       // console.log(this.state)
        return [isValid,message];
    }

    inputChangedHandler = (event, controlName) => {
        const updatedState = {...this.state}
        updatedState.fields[controlName].value = event.target.value;
        updatedState.fields[controlName].touched = true;
        [updatedState.fields[controlName].valid,updatedState.fields[controlName].messages] = this.checkValidity(event.target.value, this.state.fields[controlName].validation)
        let formIsValid = true;
        Object.keys(updatedState.fields).forEach(element => {
            formIsValid =  updatedState.fields[element].valid && formIsValid;
        }); 
                //console.log(inputIdentifier)
        updatedState.formIsValid = formIsValid;
        this.setState({fields :updatedState.fields,formIsValid:updatedState.formIsValid});
    }

    submitHandler = (event) => {
        event.preventDefault();
        console.log('hi')
        this.setState( { loading: true } );
        axios.post('//localhost:3000/get_auth_token/',{username:this.state.fields.username.value,password:this.state.fields.password.value})
            .then( response => {
                console.log(this.props)
                localStorage.setItem('token',response.data.token)
                this.setState( { loading: false } );
                this.props.history.push( '/' );
            } )
            .catch( error => {
                //this.setState( { loading: false } );
            } );
    }

    render () {
        const formElementsArray = [];
        let form;
        for ( let key in this.state.fields ) {
            formElementsArray.push( {
                id: key,
                config: this.state.fields[key]
            } );
        }
        if (this.state.loading)
            form = <Spinner/>
        else{
        form = formElementsArray.map( formElement => (
            <Input
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementName={formElement.config.elementTitle}
                value={formElement.config.value}
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched}
                changed={( event ) => this.inputChangedHandler( event, formElement.id )}
                messages={formElement.config.messages} />
        ) );
        }
        return (
            <div className={classes.form}>
                <h3>Login</h3>
                <form onSubmit={this.submitHandler}>
                    {form}
                    <button className = {classes.Button} disabled={!this.state.formIsValid}>Login</button>
                </form>
            </div>
        );
    }
}

export default Login;