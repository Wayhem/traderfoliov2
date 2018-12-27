import React, { Component } from "react";
import Card from './Card';

class Content extends Component{

    componentDidMount() {
        document.querySelector('#sidebarCollapse').addEventListener('click', () => {
            document.querySelector('#sidebar').classList.toggle('active');
        });
    }

    componentDidUpdate() {
        this.render();
    }

    renderCards = () => {
        let items = [];
        this.props.balance.forEach((value, key) => {
            items.push(<Card key={key} ticker={this.props.api[key].FullName} value={value} imgUrl={this.props.api[key].ImageUrl} />);
        })
        return items;
    }

    render(){
        return(
            <div id="content" className="ml-3 container">
            <nav className="navbar navbar-expand-lg navbar-light pt-4">
                <div className="container-fluid">
        
                    <button type="button" id="sidebarCollapse" className="btn btn-dark">
                        <i className="fas fa-align-left"></i>
                        <span></span>
                    </button>
                </div>
            
            </nav>
            <div className="container-fluid pt-2">
                <h5 className="balance-text">Balance</h5>
                <h1 id="balance" className="text-simple">$0</h1>
                {this.renderCards()}
            </div>
        </div>    
        );
  }
}

export default Content;