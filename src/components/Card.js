import React from "react";

export default function Card(props) {
    return <div className="card my-3 col-12 col-md-5 col-xl-3" style={{width: '18rem'}}>
        <div className="card-body">
            <h5 className="card-title text-simple">{props.ticker}</h5>
            <p className="card-text">{props.value}</p>
            <img src={`https://www.cryptocompare.com${props.imgUrl}`} alt="" className="justify-content-end" style={{ width: '3rem', display:'inline-block', position:'absolute', bottom: '1.25rem', right: '1.25rem' }} />
        </div>
    </div>
}