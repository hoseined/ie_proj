import React, { Component } from 'react';

import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './form.module.css';
import Input from '../../components/UI/Input/Input';
import axios from 'axios'
class form extends Component {
    constructor(props){
        super(props);
       console.log(this.props)
        let nextState =this.props.location.state;
        nextState.fields.forEach(element => {
            switch(element.type.trim().toLowerCase()){
                case("dropdown"):
                    element.options = element.value;
                    element.value =element.options[0].value;
                    console.log(element.value)
                break;
                case("email"):
                    element.validation ={
                        "required" : true,
                        "isEmail" : true
                    }
                    element.value ='';
                break;
                case("number"):
                    element.validation={
                        "required" : true,
                        "isNumber" : true
                    }
                    element.value ='';
                break;
                case("date"):
                    element.validation={
                        "required" : true
                    }
                    element.value ='';
                break;
                case("location"):
                    element.value ='';
                break;
                case("name"):
                element.validation={
                    "required" : true,
                    "isName" : true
                }
                element.value ='';
                break;
                default:
                    element.validation={
                        "required" : true
                    }
                    element.value ='';
            }
            if(!element.validation || !element.validation.required)
                element.valid =true;
            else
                element.valid = false;
            element.touched = false;
        });
       console.log(nextState)
        this.state ={form:nextState,formIsValid: false,loading: false}
       // console.log(this.state)
    }
    componentDidMount(){
        if(this.state.form.fields.find((element => element.name === 'location'))){
            this.getcurrentLocation().then(data =>{
               // console.log(data)
                const updatedform = [...this.state.form.fields];
                let temp = updatedform.find(element => element.name === "location");
                const updatedFormElement = {...temp};
                updatedFormElement.value = data;
                let index = updatedform.findIndex((element) => element.name === "location")
                updatedform.splice(index,1,updatedFormElement);
                //console.log(updatedform)
                this.setState({form: {title :this.state.form.title, fields : updatedform}});
        }).catch(data=>{
            const updatedform = [...this.state.form.fields];
            let temp = updatedform.find(element => element.name === "location")
            const updatedFormElement = {...temp}
            updatedFormElement.value = data;
            let index = updatedform.findIndex((element) => element.name === "location")
          //  console.log(index)
            updatedform.splice(index,1,updatedFormElement);
            //console.log(updatedform)
            this.setState({form: {title :this.state.form.title, fields : updatedform}});
        });
    }
    }
    getcurrentLocation() {
        if (navigator && navigator.geolocation) {
          return new Promise((resolve, reject) => {
              const options = {enableHighAccuracy : true,timeout: 1000,maximumAge:10000}
              navigator.geolocation.getCurrentPosition(pos => {
              const coords = pos.coords;
              resolve([
                coords.latitude,
                coords.longitude
              ]
              );
            },() =>{console.log("reject")
                reject([35.68627757389,51.39068621881188])},options);
          });
        }
      }
    formHandler = ( event ) => {
        event.preventDefault();
        this.setState( { loading: true } );
        let temp = JSON.parse(JSON.stringify(this.state));
        console.log(temp)
        delete temp.formIsValid;
        delete temp.loading;
        temp.form.fields.forEach((element)=>{
            console.log(temp)
            if(element.type ==="location"){
                //temp.form.location = [-299.53125, 38.272688535980976];
                temp.form.location = element.value;
                console.log("******************", temp.form.location)
            }
            delete element.valid;
            delete element.touched;
            delete element.messages;
            delete element.options;
            delete element.validation;
        })
        
        console.log(temp.form)
        const token=localStorage.getItem('token')
        axios.post( '//localhost:4000/submit_form',temp.form ,{headers: {
            Authorization:token
          }})
            .then( response => {
                console.log(response)
                this.setState( { loading: false } );
                this.props.history.push( '/' );
            } )
            .catch( error => {
                this.setState( { loading: false } );
            } );
    }
    checkValidity(value, rules) {
        let message = []
        let isValid = true;
        if (!rules) {
            return [true,[]];
        }
        if (rules.required) {
            console.log(value)
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
        if (rules.isNumber && value.trim()!=='') {
            const pattern = /[0-9]$/;
            isValid = pattern.test(value) && isValid
            if(!isValid)
                message.push('please insert a valid Number');
        }
       // console.log(this.state)
        return [isValid,message];
    }
    inputChangedHandler = (event, inputIdentifier) => {
        const updatedform = [...this.state.form.fields];
        let temp = updatedform.find(element => element.name === inputIdentifier)
        
        const updatedFormElement = {...temp}

        if(inputIdentifier === 'location')
        {
           // console.log(event)
            updatedFormElement.value = [event.lat, event.lng];
        }
        else
            updatedFormElement.value = event.target.value;
        [updatedFormElement.valid,updatedFormElement.messages] = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.touched = true;
        let index = updatedform.findIndex((element) => element.name === inputIdentifier)
        updatedform.splice(index,1,updatedFormElement);
        let formIsValid = true;
        for (let inputIdentifier of updatedform) {
            //console.log(inputIdentifier)
            formIsValid = inputIdentifier.valid && formIsValid;
        }
        this.setState({form: {title :this.state.form.title, fields : updatedform}, formIsValid: formIsValid});
    }
    render () {
        //console.log(classes)
        const formElementsArray = JSON.parse(JSON.stringify(this.state.form.fields));
        let form = (
            <form onSubmit={this.formHandler}>
                {formElementsArray.map((formElement,index) => (
                    <Input 
                        key={index}
                        elementName={formElement.name}
                        elementType={formElement.type}
                        elementOptions={formElement.options}
                        value={formElement.value}
                        invalid={!formElement.valid}
                        shouldValidate={formElement.validation}
                        touched={formElement.touched}
                        changed={(event) => this.inputChangedHandler(event, formElement.name)}
                        messages={formElement.messages}
                         />
                ))}
                <button className = {classes.Button} disabled={!this.state.formIsValid}>SUBMIT</button>
            </form>
        );
        if ( this.state.loading ) {
            form = <Spinner />;
        }
        return (
                <div className={classes.form}>
                    <h3>{this.state.form.title}</h3>
                    {form}
                </div>
        );
    }
}

export default form;