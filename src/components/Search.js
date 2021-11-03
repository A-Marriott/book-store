import React, {useState} from "react";
import {connect} from "react-redux";
import {
    Link,
    useParams
} from "react-router-dom";

const Search = ({noResults, books, search}) => {
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
                <input type="submit"/>
            </form>
            {noResults ? <h1>No results!</h1> :
                <div>
                    {books.map((book) => {
                        return (
                            <Link to={`/book/${book.id}`} key={book.id}>
                                <p>{book.volumeInfo.title}</p>
                            </Link>
                        )
                    })}
                </div>
            }
            <button onClick={() => console.log(books)}>log books</button>
        </div>
    );
};

const mapState = (state) => ({
    books: state.search.results,
    noResults: state.search.noResults,
});

const mapDispatch = (dispatch) => ({
    search: (query) => dispatch.search.fetchBooks(query),
});

export default connect(mapState, mapDispatch)(Search);
