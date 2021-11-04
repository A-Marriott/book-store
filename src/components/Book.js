import React, {useEffect, useState} from "react";
// import {connect} from "react-redux";
import {useParams} from "react-router-dom";
import {fetchBook} from "../store/service";

const Book = () => {
    let {id} = useParams();

    const [book, setBook] = useState({});

    useEffect(async () => {
        const selectedBook = await fetchBook(id)
        setBook(selectedBook)
    }, [id])

    const {volumeInfo: {title: name, description} = {}, saleInfo: {retailPrice: {amount, currencyCode} = {}} = {}} = book

    return (
        <div>
            Book details
            <p>Title: {name}</p>
            <p>Price: {amount} {currencyCode}</p>
            <p>Description: {description}</p>
        </div>
    );
};

export default Book;
