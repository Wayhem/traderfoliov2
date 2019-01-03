/* eslint-disable no-unused-expressions */
import './Modal.css';
import { Container } from 'unstated';
import Swal from 'sweetalert2';
import React from 'react';
import { debounce } from 'lodash';

class ModalContainer extends Container {

    state = {
        ticker: '',
        amount: '',
        value: '',
        activeSuggestion: 0,
        filteredSuggestions: [],
        showSuggestions: false
    }

    format(ticker, amount) {
        //handling empty input no swal 
        if (amount) {
            ticker = ticker.toUpperCase();
            amount = parseFloat(amount);
            if (isNaN(amount)) {
                Swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Insert valid number!'
                })
            }
        } else {
            amount = NaN;
        }
        return { ticker, amount }
    }

    getInput = (tickers) => {
        const inputs = this.format(this.state.ticker, this.state.amount);
        if(!(tickers.filter(tickers => tickers === inputs.ticker)[0])){ 
            inputs.amount = NaN;
            Swal({
                type: 'error',
                title: 'Oops...',
                text: 'Insert valid ticker!'
            })
        }
        if (this.state.filteredSuggestions.length){
            this.resetSuggestions()
        }
        return inputs;
    }

    cleanState = () => {
        this.setState({ticker: '', amount: '', value: ''})
    }

    onChange = debounce((text, tickers) => {
        const input = text;
        const filteredSuggestions = tickers.filter(tickers => tickers.startsWith(input.toUpperCase()));
        this.setState({ 
            activeSuggestion: 0,
            filteredSuggestions,
            showSuggestions: true,
            ticker: input
        })
    }, 500);

    handleInput(value) {
        this.setState({value});
    }

    onKeyDown = (e) => {
        const { activeSuggestion, filteredSuggestions } = this.state;
        if (e.keyCode === 13) {
            e.preventDefault();
            if (this.state.filteredSuggestions.length){
                this.setState({
                    ticker: filteredSuggestions[activeSuggestion].split(' ')[0],
                    value: filteredSuggestions[activeSuggestion].split(' ')[0]
                });
                this.resetSuggestions();
                document.querySelector('#input2').focus();
            }
        }
        else if (e.keyCode === 38) {
            if (activeSuggestion === 0) {
              return;
            }
            this.setState({ activeSuggestion: activeSuggestion - 1 });
            let selection = document.querySelector('.suggestion-active');
            selection ? selection.scrollIntoView() : '';
        }
        else if (e.keyCode === 40) {
            if (activeSuggestion - 1 === filteredSuggestions.length) {
                return;
            }
            this.setState({ activeSuggestion: activeSuggestion + 1 });
            let selection = document.querySelector('.suggestion-active');
            selection ? selection.scrollIntoView() : '';
        }
    }

    onClick = e => {
        e.preventDefault();
        if (this.state.filteredSuggestions.length){
            this.resetSuggestions();
            this.setState({
            ticker: e.currentTarget.innerText.split(' ')[0],
            value: e.currentTarget.innerText.split(' ')[0]
            });
            document.querySelector('#input2').focus();
        }
      };
    
    resetSuggestions() {
        this.setState({
            activeSuggestion: 0,
            showSuggestions: false,
            filteredSuggestions: []
        })
    }

    renderSuggestions(api) {
        const {
            onClick,
            state: {
              activeSuggestion,
              filteredSuggestions,
              showSuggestions,
              ticker
            }
        } = this;
      
        let suggestionsListComponent;
      
        if (showSuggestions && ticker) {
            if (filteredSuggestions.length) {
                suggestionsListComponent = (
                <ul className="suggestions">
                    {filteredSuggestions.map((elem, index) => {
                    let className;

                    // Flag the active suggestion with a class
                    if (index === activeSuggestion) {
                        className = "suggestion-active";
                    }

                    return (
                        <li
                        className={className}
                        key={elem}
                        onClick={onClick}
                        >
                        {elem} ({api[elem].CoinName})
                        </li>
                    );
                    })}
                </ul>
                );
            } else {
                suggestionsListComponent = (
                <div className="no-suggestions">
                    <em>No results!</em>
                </div>
                );
            }
        }
        return suggestionsListComponent;
    }
}

export default ModalContainer;