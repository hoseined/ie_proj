import React from 'react';
import Role from './../role/Role'


const roles = (props) => {
    const users = ['field agent','Control Center Agent'];
    return(
        users.map((key,index) => {
            return  (
                <Role key ={index} title={key}></Role>
                )
            }
        )
    )
};

export default roles;