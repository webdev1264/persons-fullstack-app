import Person from "./Person";

const Persons = ({ persons, handleDeletePerson }) => {
  return (
    <>
      <h2>Numbers</h2>
      <ul>
        {persons.map((person) => {
          return (
            <Person
              key={person.name}
              person={person}
              handleDeletePerson={handleDeletePerson}
            />
          );
        })}
      </ul>
    </>
  );
};

export default Persons;
