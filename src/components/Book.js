import React, { useEffect } from "react";
import {Link, useParams} from "react-router-dom";
import { connect } from "react-redux";

const Book = ({
  addBook,
  fetchBook,
  book,
  totalPrice,
}) => {

  let { id } = useParams();
  useEffect(() => {
    fetchBook({ id });
  }, [id]);

  const {
    volumeInfo: { title: name, description } = {},
    saleInfo: { retailPrice: { amount, currencyCode } = {} } = {},
  } = book;

  return (
    <div>
        <Link to={'/basket'}>BASKET</Link>
      Book details
      <p>Title: {name}</p>
      <p>
        Price: {amount} {currencyCode}
      </p>
      <p>Description: {description}</p>
      <button
        onClick={() => {
          addBook(book);
        }}
        data-testid="add-book-button"
      >
        Add to basket
      </button>
      <h6>{totalPrice}</h6>
    </div>
  );
};

const mapState = (state) => ({
  book: state.search.book,
  totalPrice: state.basket.totalPrice,
});

const mapDispatch = (dispatch) => ({
  addBook: dispatch.basket.addBook,
  fetchBook: dispatch.search.fetchBook,
});

export default connect(mapState, mapDispatch)(Book);
