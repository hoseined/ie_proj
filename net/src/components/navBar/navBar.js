import React from 'react'
import {Link} from 'react-router-dom'
import classes from './navBar.module.css'
class NavBar extends React.Component{
    render(){
        console.log('hiiiiiiiiiiiii')
        let navBar = undefined;
        navBar = localStorage.getItem('token') ? (<ul>
            <li><Link
                to="/"
            >home</Link></li>
            <li style={{float : "right"}} onClick={()=>{this.forceUpdate() 
                    localStorage.clear()}}><Link
            to="/"
                >Logout</Link></li>
        </ul>): (
                <ul>
                    <li><Link
                        to="/"
                        >home</Link>
                    </li>
                    <li style={{float : "right"}}>
                    <Link
                        to="/Login"
                        >Login</Link>
                    </li>
                    <li style={{float : 'right'}}>
                    <Link
                        to="/Signup"
                        >Sign up</Link>
                    </li>
                </ul>)
        return(
            <div className={classes.Blog}>
                <header>
                    <nav>
                        {navBar}
                    </nav>
                </header>
            </div>
        )
    }
}

export default NavBar