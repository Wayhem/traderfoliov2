import './Modal.css';
import { Container } from 'unstated';
import Swal from 'sweetalert2';
import React from 'react';

class ModalContainer extends Container {

    state = {
        ticker: '',
        amount: '',
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
        if(!(this.exactSearch(inputs.ticker, tickers)[0] === inputs.ticker)){
            inputs.amount = NaN;
            Swal({
                type: 'error',
                title: 'Oops...',
                text: 'Insert valid ticker!'
            })
        }
        if (this.state.filteredSuggestions.length){
            this.setState({
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false
            });
        }
        return inputs;
    }

    cleanState = () => {
        this.setState({ticker: '', amount: ''})
    }

    onChange(e, tickers) {
        const input = e.target.value;
        const filteredSuggestions = this.search(input, tickers);
        this.setState({ 
            activeSuggestion: 0,
            filteredSuggestions,
            showSuggestions: true,
            ticker: input
        })
    }

    onKeyDown = (e) => {
        const { activeSuggestion, filteredSuggestions } = this.state;
        if (e.keyCode === 13) {
            e.preventDefault();
            if (this.state.filteredSuggestions.length){
                this.setState({
                    activeSuggestion: 0,
                    showSuggestions: false,
                    filteredSuggestions: [],
                    ticker: filteredSuggestions[activeSuggestion].split(' ')[0]
                });
                document.querySelector('#input2').focus();
            }
        }
        else if (e.keyCode === 38) {
            if (activeSuggestion === 0) {
              return;
            }
            this.setState({ activeSuggestion: activeSuggestion - 1 });
            let selection = document.querySelector('.suggestion-active');
            selection ? selection.scrollIntoView() : selection = selection;
        }
        else if (e.keyCode === 40) {
            if (activeSuggestion - 1 === filteredSuggestions.length) {
                return;
            }
            this.setState({ activeSuggestion: activeSuggestion + 1 });
            let selection = document.querySelector('.suggestion-active');
            selection ? selection.scrollIntoView() : selection = selection;
        }
    }

    onClick = e => {
        e.preventDefault();
        if (this.state.filteredSuggestions.length){
            this.setState({
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            ticker: e.currentTarget.innerText.split(' ')[0]
            });
            document.querySelector('#input2').focus();
        }
      };


    search(input, tickers) {
        let results = [];
        for (const elem of tickers) {
            if (elem.substr(0, input.length).toUpperCase() == input.toUpperCase()) {
                results.push(elem);
            }
        }
        return results;
    }

    exactSearch(input, tickers) {
        let results = [];
        for (const elem of tickers) {
            if (elem.toUpperCase() == input.toUpperCase()) {
                results.push(elem);
            }
        }
        return results;
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