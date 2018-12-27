import React, { Component } from "react";

class Sidebar extends Component{

    render(){
        return(
        <nav id="sidebar">
                <div className="sidebar-header">
                    <h3 className="brand pt-5">Traderfolio</h3>
                </div>
        
                <ul className="list-unstyled components">
                    <li>
                        <a href="#homeSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Menu</a>
                        <ul className="collapse list-unstyled" id="homeSubmenu">
                            <li>
                                <a onClick={e => this.props.handleModal(e, 1)} href="">Add Funds</a>
                            </li>
                            <li>
                                <a onClick={e=> this.props.handleModal(e, 2)} href="">Remove Funds</a>
                            </li>
                            <li>
                                <a onClick={e=> this.props.handleModal(e, 3)} href="">Edit Funds</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="https://jvilladev.com">Portfolio</a>
                    </li>
                    <li>
                        <a href="https://jvilladev.com/#contact">Contact</a>
                    </li>
                </ul>
            </nav>    
        );
    }
}

export default Sidebar;