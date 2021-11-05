import React from "react";
import { connect } from "react-redux";

const Basket = ({ books, totalPrice }) => {
    return (
        <div>
            {books.map((book, index) => {
                const {
                    volumeInfo: {title: name } = {},
                    saleInfo: {retailPrice: {amount, currencyCode} = {}} = {},
                } = book;
                return (
                    <div key={index} >
                        <p>Title: {name}</p>
                        <p>Price: {amount} {currencyCode}</p>
                    </div>
                )
            })}
            <h1>Total price: {totalPrice}</h1>
        </div>
    );
};

const mapState = (state) => ({
    books: state.basket.books,
    totalPrice: state.basket.totalPrice,
});

const mapDispatch = (dispatch) => ({
});

export default connect(mapState, mapDispatch)(Basket);
