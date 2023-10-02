const Person = ({ person, handleDeletePerson }) => {
  return (
    <li className="person">
      {person.name} {person.number}{" "}
      <button onClick={() => handleDeletePerson(person.id)}>Delete</button>
    </li>
  );
};

export default Person;
