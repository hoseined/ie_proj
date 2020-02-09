import React, { Component } from 'react'
import classes from './ControlCenterAgent.module.css'
import BackDrop from './../../components/UI/BackDrop/BackDrop'
import SearchInput from './../../components/UI/SearchInput/SearchInput'
import Wrapper from './../../components/hoc/Wrapper'
import Spinner from './../../components/UI/Spinner/Spinner'
import axios from 'axios'
import { CSVLink } from "react-csv";
class Table extends Component {
   constructor(props) {
      super(props) 
      this.state = { 
         isLoading:true,
         search : false,
        //  searchparams :{
        //      id: {searchType :"num",searchValue : '',searchValue2:''},
        //      name: {searchType :"text",searchValue : ''},
        //      age: {searchType :"num",searchValue : '',searchValue2:''},
        //      email: {searchType :"text",searchValue : ''}
        //  },
         currentSearchKey : '',
         hasNumericField : ''
      }
      this.backdropclicked=this.backdropclicked.bind(this)
   }
   componentDidMount(){
    const token=localStorage.getItem('token')
    console.log(this.props)
    axios({
        method: 'get',
        url: '//localhost:4000/get_all_forms/submited/'+`${this.props.match.params.id}/`,
        headers: {
          Authorization:token
        }
      }).then((response) => {
        console.log(response.data)
        let searchParams={};
        let bool = false;
        response.data[0].fields.forEach((data)=>{
            switch(data["type"].trim().toLowerCase()){
                case("dropdown"):
                    searchParams[data.name] = {searchType :"text",searchValue : ''};
                break;
                case("date"):
                    searchParams[data.name] = {searchType :"date",searchValue : '',searchValue2:''}
                break;
                case("number"):
                    bool=true
                    searchParams[data.name] = {searchType :"num",searchValue : '',searchValue2:''}
                break;
                default:
                    searchParams[data.name] = {searchType :"text",searchValue : ''};
            }
        })
        console.log(response.data)
        response.data.forEach((data,index)=>{
            data.fields.forEach((field,index)=>{
                if(field.type==="location"){
                    let temp = field.value
                    field.value=data.area;
                    data.location=temp
                }
            })
        })
        console.log(response.data)
        this.setState({customTable:response.data,searchparams:searchParams,isLoading:false,hasNumericField:bool})
    }).catch((error)=>{
        alert(error.response.status+" : "+error.response.data)
        this.props.history.push("/")
    })
   }
renderTableHeader() {
    let headers = ['No.'];
    this.state.customTable[0].fields.forEach(array=>{
        headers.push(array['name'])
    })
    return headers.map((key, index) => {
        if(key.trim().toLowerCase() === "no.")  
            return <th key={index}>{key.toUpperCase()}</th>
        else  
            return <th key={index}>{key.toUpperCase()}<span header={key} style={{position:"absolute" , right:0,cursor:"pointer" }} onClick={(event)=>this.searchclicked(event)}>&#8981;</span></th>
    })
 }
renderTableRows(filteredrows,CSVData){
    return filteredrows.map((data,index)=>{
        let values=[];
        values.push(index+1)
        data.fields.forEach((element,index)=>{ 
            if(!(element.type.trim().toLowerCase()==='location'))
                values.push(element["value"])
            else
                values.push(data.area)
        })
        CSVData.push(values)
        values = values.map((data,index)=> <td key={index}>{data}</td>)
        return (
            <tr key={index+1} formid={data._id} onClick={(event)=>this.selectRow(event)}>
                {values}
            </tr>
        )
    })
}
renderTableNumericFieldsSum(sum,filteredrows,CSVData){
    console.log(filteredrows.length)
    if(!this.state.hasNumericField||filteredrows.length===0)
        return null;
    else{
        filteredrows.forEach((data,index)=>{
            data.fields.forEach((element,index)=>{ 
                if(element.type==="number"){
                    sum[element["name"]]+=Number(element.value);
                }
            })
        })
        sum.ID="Total";
        CSVData.push(Object.keys(sum).map((data)=>sum[data]))
        return (
            Object.keys(sum).map((data,index)=><td key={index}>{sum[data]}</td>)
        )
    }
}
 selectRow(event)
 {
    const id=event.currentTarget.getAttribute("formid")
    const table = this.state.customTable;
    let form;
    table.forEach((key)=>{
        if(key._id===id){
            form = key;
        }
    })
    console.log(form)
    this.props.history.push({
        pathname: '/specificForm'+id,
        state: { form: form }
      })
 }
 searchclicked(event){
    const key=event.currentTarget.getAttribute("header");
    this.setState({search:true,currentSearchKey:key})
 }
searchInputChanged(event){
     let temp = {...this.state};
     temp.searchparams[this.state.currentSearchKey].searchValue = event.target.value;
     this.setState(temp)
 }
secondSearchInputChanged(event){
    let temp = {...this.state};
    temp.searchparams[this.state.currentSearchKey].searchValue2 = event.target.value;
    this.setState(temp)
    //console.log(temp,event)
 }
inputClicked(event){
    event.stopPropagation();
 }
backdropclicked(){
    this.setState({search:false});
}
buttonClicked(event){
    const key=event.currentTarget.getAttribute("header");
    let temp = {...this.state};

     temp.searchparams[key].searchValue = '';
     if(temp.searchparams[key].searchValue2){
        temp.searchparams[key].searchValue2=''
     }
     this.setState(temp)
}
multipleFilter(){
    let filteredrows=JSON.parse(JSON.stringify(this.state));
    filteredrows = filteredrows.customTable;
    console.log(filteredrows)
    Object.keys(this.state.searchparams).forEach(element => {
        if(this.state.searchparams[element].searchValue||this.state.searchparams[element].searchValue2){
            if(this.state.searchparams[element].searchType==="text"){
                let temp=[]
                for(let i=0;i<filteredrows.length;i++){
                    temp = filteredrows[i].fields.filter(data=>{
                        if(data["name"]===element){
                            console.log(data["value"],this.state.searchparams[element].searchValue)
                            return data["value"].toLowerCase().includes(this.state.searchparams[element].searchValue.toLowerCase())
                        }
                    })
                    if(temp.length===0){
                        filteredrows.splice(i,1)
                        i=i-1;
                    }
                }
            }
            else if(this.state.searchparams[element].searchType==="num"){
                let temp=[]
                let Max = this.state.searchparams[element].searchValue2 ? this.state.searchparams[element].searchValue2 :Infinity;
                let Min = this.state.searchparams[element].searchValue ? this.state.searchparams[element].searchValue :0
                for(let i=0;i<filteredrows.length;i++){
                    temp = filteredrows[i].fields.filter(data=>{
                        if(data["name"]===element){
                            return (Number(data["value"])>= Number(Min)) && (Number(data["value"])<= Number(Max))
                        }
                    })
                    console.log(temp)
                    if(temp.length===0){
                        filteredrows.splice(i,1)
                        i=i-1;
                    }
                }                   
            }
            else if(this.state.searchparams[element].searchType==="date"){
                let temp=[]
                let Max = this.state.searchparams[element].searchValue2 ? new Date(this.state.searchparams[element].searchValue2) :new Date(8640000000000000);
                let Min = this.state.searchparams[element].searchValue ? new Date(this.state.searchparams[element].searchValue) :new Date(-8640000000000000)
                for(let i=0;i<filteredrows.length;i++){
                    temp = filteredrows[i].fields.filter(data=>{
                        if(data["name"]===element){
                            console.log(new Date(data["value"]),Min,Max)
                            return new Date(data["value"])>=Min && new Date(data["value"])<=Max
                        }
                    })
                    if(temp.length===0){
                        filteredrows.splice(i,1)
                        i=i-1;
                    }
                }                   
            }
        }
    });
    return filteredrows;
}
 render() {
    console.log(this.state)
    let view = undefined;
    if(this.state.isLoading){
        view =<Spinner/>
    }
    else{
        let sum = {};
        let CSVData =[];
        let headers = ['ID'];
        sum.ID=0;
        this.state.customTable[0].fields.forEach(array=>{
            if(array.type==="number")
                sum[array["name"]]=0
            else
                sum[array["name"]]='_'
            headers.push(array['name'])
        })
        CSVData.push(headers)
        console.log(sum);
        let filteredrows = this.multipleFilter();
        let temp = this.state.search ?<SearchInput clicked={(event)=>{this.inputClicked(event)}} elementType={this.state.searchparams[this.state.currentSearchKey].searchType} elementTitle={this.state.currentSearchKey +" Search"} value2={this.state.searchparams[this.state.currentSearchKey].searchValue2} value={this.state.searchparams[this.state.currentSearchKey].searchValue} changed={(event)=>this.searchInputChanged(event)} changed2={(event)=>this.secondSearchInputChanged(event)} ></SearchInput>:null
        //console.log(filteredrows);
        let buttons=[];
        Object.keys(this.state.searchparams).forEach(value=>{
            if(this.state.searchparams[value].searchValue||this.state.searchparams[value].searchValue2){
                    buttons.push(<button key={value} header={value} type="button" onClick={(event)=>this.buttonClicked(event)} className={classes.removeButton}>{value+" filter remove "}</button>)
            }
        })
        view = 
        (<Wrapper >
        <BackDrop show={this.state.search} clicked={this.backdropclicked}>
            {temp}
        </BackDrop>
        <div className={classes.tablescroll}>
            {buttons}
            <table className={classes.customTable}>
                <tbody>
                    <tr>{this.renderTableHeader()}</tr>
                    {this.renderTableRows(filteredrows,CSVData)} 
                    <tr>{this.renderTableNumericFieldsSum(sum,filteredrows,CSVData)}</tr>
                </tbody>
            </table>
        </div>
        <div className = {classes.Link}>
            <CSVLink
                data={CSVData}
                filename={"my-file.csv"}
                target="_blank"
            >
            <button className={classes.Button}>CSV Export</button>
            </CSVLink>
        </div>
    </Wrapper>)
    }
    return (
      <Wrapper>
        {view}
      </Wrapper>
    )
 }
}
export default Table