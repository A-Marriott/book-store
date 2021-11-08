import React, { useEffect } from "react";
import { connect } from "react-redux";

const Basket = ({ books, totalPrice, removeBook }) => {
  // useEffect(() => {
  //   applyDiscount();
  // }, [applyDiscount]);

  return (
    <>
      {books.length === 0 ? (
        <p>Your basket is empty</p>
      ) : (
        <div>
          <h1>Total price: {totalPrice}</h1>
          <br />
          {books.map((book, index) => {
            const {
              volumeInfo: { title: name } = {},
              saleInfo: { retailPrice: { amount, currencyCode } = {} } = {},
            } = book;
            return (
              <div key={index}>
                <h4>Title: {name}</h4>
                <p>
                  Price: {amount} {currencyCode}
                </p>
                <button
                  onClick={() => {
                    removeBook(book);
                  }}
                  data-testid={`remove-book-button-${index}`}
                >
                  Remove from basket
                </button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

const mapState = (state) => ({
  books: state.basket.books,
  totalPrice: state.basket.totalPrice,
});

const mapDispatch = (dispatch) => ({
  removeBook: dispatch.basket.removeBook,
  // applyDiscount: dispatch.basket.applyDiscount,
});

export default connect(mapState, mapDispatch)(Basket);
