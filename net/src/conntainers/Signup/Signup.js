import React, { Component } from 'react';

import Input from '../../components/UI/Input/Input';
import classes from './Signup.module.css';
import axios from 'axios'
import Spinner from '../../components/UI/Spinner/Spinner';
class Signup extends Component {
    state = {
        fields: {
            username:{
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
            email: {
                elementType: 'input',
                elementTitle: 'email',
                value: '',
                validation: {
                    required: true,
                    isEmail: true
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
            },
            role:{
                elementType: 'dropdown',
                elementTitle: 'role',
                elementOptions:[
                    {"label" : "cca" , "value" : "Control Center Agent"}, 
                    {"label" : "fa" , "value" : "Field Agent"} 
                ],
                value: '',
                touched:false,
                valid:true
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
        const updatedState = {
            ...this.state}
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
        this.setState( { loading: true } );
        console.log( this.state.fields.role.value.trim().toLocaleLowerCase())
        let is_staff = this.state.fields.role.value.trim().toLocaleLowerCase()==="field agent" ? false :true
        console.log(is_staff)
        localStorage.setItem('isAdmin',is_staff)
        axios.post( '//localhost:4000/register/',{username:this.state.fields.username.value,password:this.state.fields.password.value,email:this.state.fields.email.value,is_staff:is_staff})
            .then( response => {
                console.log(response)
                localStorage.setItem('token',response.data.token)
                this.setState( { loading: false } );
                this.props.history.push( '/' );
            } )
            .catch( error => {
                //this.setState( { loading: false } );
            } );
        console.log('hi')
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
        console.log(formElementsArray)
        if (this.state.loading)
            form = <Spinner/>
        else{
        form = formElementsArray.map( formElement => (
            <Input
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementName={formElement.config.elementTitle}
                elementOptions={formElement.config.elementOptions}
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
                <h3>Signup</h3>
                <form onSubmit={this.submitHandler}>
                    {form}
                    <button className = {classes.Button} disabled={!this.state.formIsValid}>Login</button>
                </form>
            </div>
        );
    }
}

export default Signup;