/* eslint-disable no-unused-expressions */
import React, { Component } from "react";
import Swal from 'sweetalert2';
import Sidebar from "./components/Sidebar";
import Content from "./components/Content";
import ModalContainer from "./components/containers/ModalContainer";
import { Provider, Subscribe } from 'unstated';
import { ReactComponent as Blockchain } from './images/blockchain.svg';
import "./App.css";


class App extends Component{
  handleModal = (e, type) => {
    if (e) {
      e.preventDefault();
    }
    if (type) {
      this.setState({actionType: type});
    }
    document.querySelector('.bg-modal').classList.toggle('hidden');
    document.querySelector('.bg-modal').classList.toggle('visible');
    let inputs = Array.from(document.querySelectorAll('.modal-input'));
    inputs.forEach(el => el.value = '');
  }

  state = {
    balance : new Map(),
    allTickers: [],
    APIData: {},
    bitDiff: 1,
    actionType: 0
  }

  updateBalance() {
    let keys = '';
    Array.from(this.state.balance).forEach((el) => {
      keys += (`${el[0]},`)
    })
    keys = keys.slice(0,keys.length - 1)
    fetch(`https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${keys}&api_key=${process.env.API_KEY}`)
      .then(res => res.json())
      .then(data => {
        this.showBalance(data);
      });
  }
  
  showBalance(data) {
    let total = 0;
    for (let [key, value] of Object.entries(data)) {
      const amount = this.state.balance.get(key);
      total += (amount/value);
    } 
    isNaN(total) ? total = 0 : '';
    document.getElementById('balance').textContent = `$${total.toFixed(2)} / ${(total*this.state.bitDiff).toFixed(8)} BTC`;
  }

  getInput = (modal, e) => {
    e.preventDefault();
    const inputs = modal.getInput(this.state.allTickers);
    if (!isNaN(inputs.amount)) {
      this.setInputs(inputs);
      this.handleModal();
      this.updateBalance();
    }
  }

  setInputs = (inputs) => {
    const balance = this.state.balance;
    if (this.state.actionType === 1) {
      if(balance.get(inputs.ticker)) {
        inputs.amount += balance.get(inputs.ticker)
      }
      balance.set(inputs.ticker, inputs.amount);
    } else if (this.state.actionType === 2) {
      if(balance.get(inputs.ticker)){
        if (balance.get(inputs.ticker) > inputs.amount) {
          const result = balance.get(inputs.ticker) - inputs.amount;
          balance.set(inputs.ticker, result);
        } else {
          balance.delete(inputs.ticker);
        }
      } else {
        Swal({
          type: 'error',
          title: 'Oops...',
          text: `You do not have ${inputs.ticker} balance!`
      })
      }
    } else if (this.state.actionType === 3) {
      balance.set(inputs.ticker, inputs.amount);
    }
    this.setState({ balance, actionType: 0 });
  }

  componentDidMount() {
    fetch(`https://min-api.cryptocompare.com/data/all/coinlist?api_key=${process.env.API_KEY}`)
      .then(res => res.json())
      .then(data => {
        this.setState({allTickers: Object.keys(data.Data), APIData: data.Data});
      });
    fetch(`https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=BTC&api_key=${process.env.API_KEY}`)
      .then(res => res.json())
      .then(data => {
        this.setState({bitDiff: data.BTC});
      });
  }

  render(){
    return(
      <div className="wrapper">
        <Sidebar handleModal={this.handleModal} />
        <Content balance={this.state.balance} api={this.state.APIData} />
        <Provider>
          <Subscribe to={[ModalContainer]}>
            {modal => (
              <div className="bg-modal hidden"> 
                <div className="modal-content">
                  <div className="close" onClick={(e) => {this.handleModal(e); modal.cleanState();}}>+</div>
                  <Blockchain />
                  <form autoComplete="off" className="modal-form" onSubmit={(e) => this.getInput(modal, e)}>
                      <input 
                          autoComplete="off"
                          id="input" 
                          className="modal-input Input-text" 
                          type="text" 
                          placeholder="BTC, ETH, or.." 
                          value={modal.state.ticker}
                          onChange={e => modal.onChange(e, this.state.allTickers)}
                          onKeyDown={e => modal.onKeyDown(e)}
                      />
                      <label htmlFor="input" className="Input-label">Ticker</label>
                      {modal.renderSuggestions(this.state.APIData)}
                      <input 
                          autoComplete="off"
                          id="input2" 
                          className="modal-input Input-text" 
                          type="text"
                          min="0"
                          step="0.01" 
                          placeholder="Amount" 
                          value={modal.state.amount}
                          onChange={e => modal.setState({ amount: e.target.value })}
                      />
                      <label htmlFor="input2" className="Input-label2">Amount</label>
                      <button id="addButton" className="btn btn-primary badge-pill">Submit</button>
                    </form>
                  </div>
                </div>
            )}
          </Subscribe>
        </Provider>
      </div>
    );
  }
}

export default App;