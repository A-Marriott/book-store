import React, {useEffect, useState} from "react";
// import {connect} from "react-redux";
import {useParams} from "react-router-dom";
import {fetchBook} from "../store/service";
import {connect} from "react-redux";

const Book = ({ addBook }) => {
    let {id} = useParams();
    const [book, setBook] = useState({});

    useEffect(async () => {
        const selectedBook = await fetchBook(id)
        setBook(selectedBook)
    }, [id])

    const {
        volumeInfo: {title: name, description} = {},
        saleInfo: {retailPrice: {amount, currencyCode} = {}} = {}
    } = book

    return (
        <div>
            Book details
            <p>Title: {name}</p>
            <p>Price: {amount} {currencyCode}</p>
            <p>Description: {description}</p>
            <button
                onClick={() => {
                    addBook(book)
                }}
            >
                Add to basket
            </button>
        </div>
    );
};

const mapDispatch = (dispatch) => ({
    addBook: (book) => dispatch.basket.addBook(book),
});

export default connect(null, mapDispatch)(Book);