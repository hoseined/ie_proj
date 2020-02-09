import React from 'react';
import Input from './../../components/UI/Input/Input'
import classes from './specificForm.module.css'
import GoogleMapReact from 'google-map-react';
const specificForm = (props)=>{
    const renderMarkers = (map, maps) => {
        let location;
        //location = JSON.parse("["+props.location.state.form.location+"]")
        location = props.location.state.form.location;
        console.log(location)
        let marker = new maps.Marker({
        position: { lat: location[0], lng: location[1] },
        map,
        title: 'your location'
        });
        return marker;
    };
    let inputElements = []
    props.location.state.form.fields.forEach((element,index) => {
        if(element.type!=="location")
            inputElements.push(<Input key={index} elementType={"text"} elementName ={element.name} value ={element.value}></Input>)
        else{
            inputElements.push((
            <div key={index} className={classes.Input}>
                <label className={classes.Label}>{element.name}</label>
                <div  style={{ height: '250px', width: '100%' }}>
                    <GoogleMapReact 
                    bootstrapURLKeys={{ key: "AIzaSyDjs0u02-62FMwrtxMxci5pc6PIubSyW28"}}
                    defaultZoom={5}
                    defaultCenter={[36,51.9]}
                    yesIWantToUseGoogleMapApiInternals ={true}
                    onGoogleApiLoaded={({ map, maps }) => renderMarkers(map, maps)}
                    >
                    </GoogleMapReact>
                </div>
            </div>))
        }
    });
    return(
        <div className={classes.form}>
            {inputElements}
        </div>
    )
}
export default specificForm