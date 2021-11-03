import React from "react";
import { connect } from "react-redux";

const Search = ({ count }) => {
  return (
    <div>
      Search page
      <div>{count}</div>
    </div>
  );
};

const mapState = (state) => ({
  count: state.search,
});

const mapDispatch = (dispatch) => ({});

export default connect(mapState, mapDispatch)(Search);
