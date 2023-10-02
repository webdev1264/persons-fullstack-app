const Search = ({ search, handleChange }) => {
  return (
    <>
      {" "}
      <label htmlFor="filter">Filter shown with:</label>
      <input type="text" id="filter" value={search} onChange={handleChange} />
    </>
  );
};

export default Search;
