import React, {useEffect, useState} from "react";
// import {connect} from "react-redux";
import { useParams } from "react-router-dom";
import { fetchBook } from "../store/service";

const Book = () => {
    let { id } = useParams();

    const [book, setBook] = useState({});

    useEffect(async () => {
        const selectedBook = await fetchBook(id)
        setBook(selectedBook)
    }, [id])


    return (
        <div>
            Book details
            <h1>{book?.id}</h1>
        </div>
    );
};

export default Book;
