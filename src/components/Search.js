import React, { useState } from "react";
import { connect } from "react-redux";

const Search = ({ books, search }) => {
  const [query, setQuery] = useState("");

  return (
    <div>
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
      <div>
        {books.map((book) => {
          return <p key={book.id}>{book.volumeInfo.title}</p>;
        })}
      </div>
      <button onClick={() => console.log(books)}>log books</button>
    </div>
  );
};

const mapState = (state) => ({
  books: state.search.results,
});

const mapDispatch = (dispatch) => ({
  search: (query) => dispatch.search.fetchBooks(query),
});

export default connect(mapState, mapDispatch)(Search);
