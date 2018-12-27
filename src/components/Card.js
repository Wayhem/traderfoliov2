import React from "react";

export default function Card(props) {
    return <div className="card mx-3 my-3" style={{width: '18rem', display: 'inline-block'}}>
        <div className="card-body">
            <h5 className="card-title text-simple">{props.ticker}</h5>
            <p className="card-text">{props.value}</p>
            <img src={`https://www.cryptocompare.com${props.imgUrl}`} className="justify-content-end" style={{ width: '20%', height: '20%', display:'inline-block' }} />
        </div>
    </div>
}