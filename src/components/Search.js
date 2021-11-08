import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

const Search = ({ noResults, books, search, addBook, recentlyViewedBooks }) => {
  const [query, setQuery] = useState("");
  return (
    <div>
      <Link to={"/basket"}>BASKET</Link>
      <h1>Search page</h1>

      <form
        onSubmit={(formSubmit) => {
          formSubmit.preventDefault();
          search(query);
        }}
      >
        <input
          type="text"
          value={query}
          onChange={(input) => setQuery(input.target.value)}
        />
        <input type="submit" />
      </form>

      {noResults ? (
        <h1>No results!</h1>
      ) : (
        <>
          {books.map((book, index) => {
            return (
              <div key={book.id}>
                <Link to={`/book/${book.id}`}>
                  <h4>
                    {book.volumeInfo.title}: {book.saleInfo.retailPrice.amount}{" "}
                    {book.saleInfo.retailPrice.currencyCode}
                  </h4>
                </Link>
                <button
                  onClick={() => {
                    addBook(book);
                  }}
                  data-testid={`add-book-button-${index}`}
                >
                  Add to basket
                </button>
                <br />
              </div>
            );
          })}
        </>
      )}
      <h4>Recently viewed books</h4>
      {recentlyViewedBooks?.map((book) => {
        return <p key={book.id}>{book.volumeInfo.title}</p>;
      })}
    </div>
  );
};

const mapState = (state) => ({
  books: state.search.results,
  noResults: state.search.noResults,
  recentlyViewedBooks: state.search.recentlyViewedBooks,
});

const mapDispatch = (dispatch) => ({
  search: dispatch.search.fetchBooks,
  addBook: dispatch.basket.addBook,
});

export default connect(mapState, mapDispatch)(Search);
