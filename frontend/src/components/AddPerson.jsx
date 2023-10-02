const AddPerson = ({
  handleAddPerson,
  newName,
  newNumber,
  handleAddName,
  handleAddNumber,
}) => {
  return (
    <>
      <h2>Add a new</h2>
      <form onSubmit={handleAddPerson}>
        <div>
          name:{" "}
          <input
            type="text"
            value={newName}
            onChange={handleAddName}
            required
          />
        </div>
        <div>
          number:{" "}
          <input
            type="text"
            value={newNumber}
            onChange={handleAddNumber}
            required
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
};

export default AddPerson;
