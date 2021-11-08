import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

const Basket = ({
  books,
  totalPrice,
  removeBook,
  addVoucherCode,
  expired,
  invalidCode,
}) => {
  const [voucher, setVoucher] = useState("");
  return (
    <>
      <>
        <p>Add voucher</p>
        <form
          onSubmit={(formSubmit) => {
            formSubmit.preventDefault();
            addVoucherCode(voucher);
            setVoucher("");
          }}
        >
          <input
            type="text"
            value={voucher}
            onChange={(input) => setVoucher(input.target.value)}
          />
          <input type="submit" data-testid="submit" />
        </form>
        {expired && <p>Voucher code expired</p>}
        {invalidCode && <p>Voucher code invalid</p>}
      </>
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
    </>
  );
};

const mapState = (state) => ({
  books: state.basket.books,
  totalPrice: state.basket.totalPrice,
  expired: state.basket.expired,
  invalidCode: state.basket.invalidCode,
});

const mapDispatch = (dispatch) => ({
  removeBook: dispatch.basket.removeBook,
  addVoucherCode: dispatch.basket.addVoucherCode,
});

export default connect(mapState, mapDispatch)(Basket);
