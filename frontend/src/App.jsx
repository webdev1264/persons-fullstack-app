import { useEffect, useState } from "react";
import Persons from "./components/Persons";
import AddPerson from "./components/AddPerson";
import Search from "./components/Search";
import personService from "../src/services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    personService
      .getAll()
      .then((persons) => {
        setPersons(persons);
      })
      .catch((e) => console.log(e));
  }, []);

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 5000);
  };
  const showErrorMessage = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(""), 5000);
  };

  const handleAddPerson = (e) => {
    e.preventDefault();
    const foundPerson = persons.find((person) => person.name === newName);
    if (foundPerson) {
      const isConfirm = confirm(
        `${newName} is already added to the phonebook, replace the old number with a new one?`
      );
      if (isConfirm) {
        personService
          .update(foundPerson.id, { name: foundPerson.name, number: newNumber })
          .then((updatedPerson) => {
            const updatedPersons = persons.map((person) =>
              person.id === updatedPerson.id ? updatedPerson : person
            );
            setPersons(updatedPersons);
            showSuccessMessage(`${newName} number was updated.`);
          })
          .catch((e) => {
            console.log(e);
            showErrorMessage(
              `${foundPerson.name} number wasn't added due to error ${e.response.data.error}`
            );
          });
      }
    } else {
      personService
        .create({ name: newName, number: newNumber })
        .then((newPerson) => {
          setPersons(persons.concat(newPerson));
          showSuccessMessage(`${newName} was added.`);
        })
        .catch((e) => {
          console.log(e);
          showErrorMessage(`Error ${e.response.data.error}`);
        });
    }
    setNewName("");
    setNewNumber("");
  };

  const handleDeletePerson = (id) => {
    personService
      .remove(id)
      .then(() => {
        const updatedPersons = persons.filter((person) => person.id !== id);
        setPersons(updatedPersons);
        showSuccessMessage(`Record was deleted.`);
      })
      .catch(() => {
        const deletedPerson = persons.find((person) => person.id === id);
        showErrorMessage(`Record of ${deletedPerson.name} was already deleted`);
        setPersons(persons.filter((person) => person.id !== id));
      });
  };

  const filteredPersons = persons.filter((person) => {
    const personName = person.name.toLowerCase();
    const searchName = search.toLowerCase();
    return personName.includes(searchName);
  });

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={errorMessage} className="error" />
      <Notification message={successMessage} className="success" />
      <Search search={search} handleChange={(e) => setSearch(e.target.value)} />
      <AddPerson
        handleAddPerson={handleAddPerson}
        newName={newName}
        newNumber={newNumber}
        handleAddName={(e) => setNewName(e.target.value)}
        handleAddNumber={(e) => setNewNumber(e.target.value)}
      />
      <Persons
        persons={filteredPersons}
        handleDeletePerson={handleDeletePerson}
      />
    </div>
  );
};

export default App;
