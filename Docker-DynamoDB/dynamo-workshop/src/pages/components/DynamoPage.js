import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DynamoPage() {
  const [coffeeData, setCoffeeData] = useState([]);
  const [newCoffee, setNewCoffee] = useState("");
  const [newProperties, setNewProperties] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [coffeePriceSearchTerm, setCoffeePriceSearchTerm] = useState('');
  const [coffeeNameSearchTerm, setCoffeeNameSearchTerm] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);


  const fetchAllData = async () => {
    try {
      const response = await axios.get('/api/coffee');
      // Gather all unique keys across all coffee objects
      rehydrateTableHeader(response.data)
      setCoffeeData(response.data);
    } catch (error) {
      console.error('Error fetching coffee data:', error);
    }
  };

  const resetSearch = () => {
    setCoffeePriceSearchTerm('')
    setCoffeeNameSearchTerm('')
    fetchAllData()
  }
  
  // TODO Fix this
  const rehydrateTableHeader = (data) => {
    const keys = new Set();
    keys.add('name').add('arrival_date')
    console.log(data) // This is a clue :)
    setTableHeaders(Array.from(keys));
  }

  const handleAddProperty = () => {
    setNewProperties([...newProperties, { key: '', value: '' }]);
  };

  const handlePropertyChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProperties = [...newProperties];
    updatedProperties[index][name] = value;
    setNewProperties(updatedProperties);
  };

  const handleAddCoffee = async () => {
    try {
      const coffeeData = { ...newCoffee };

      newProperties.forEach((property) => {
        if (property.key && property.value) {
          if (property.key === 'price'){
            coffeeData[property.key?.toLowerCase()] = +property.value;
          }else{
            coffeeData[property.key?.toLowerCase()] = property.value;
          }
          
        }
      });

      await axios.post('/api/coffee', coffeeData);
      setNewCoffee({ name: '', arrival_date: '' });
      setNewProperties([]);
      // Refresh the coffee data after adding a new coffee
      fetchAllData()
    } catch (error) {
      console.error(`Error adding coffee: ${error}`);
    }
  };

  const fetchCoffeePrice = async () => {
    try {
      if (coffeeNameSearchTerm === "" || coffeePriceSearchTerm === "") {
        alert("Empty filters, select some to search")
        return
      }
      const response = await axios.get(`/api/coffeePrice?name=${coffeeNameSearchTerm}&maxPrice=${coffeePriceSearchTerm}`);
      // Gather all unique keys across all coffee objects
      setCoffeeData(response.data);
    } catch (error) {
      console.error('Error fetching coffee data:', error);
    }
  };


  return (
    <div>
      <div>
        <h1>CoffeePrice</h1>
        <input
          type="text"
          placeholder="Coffee Name"
          value={coffeeNameSearchTerm}
          onChange={(e) => setCoffeeNameSearchTerm(e.target.value)}
        />
        <input
          type="text"
          placeholder="Max Price"
          value={coffeePriceSearchTerm}
          onChange={(e) => setCoffeePriceSearchTerm(e.target.value)}
        />
        <button onClick={fetchCoffeePrice}>Search Coffee</button>
        <button onClick={resetSearch}>Reset</button>
      </div>
      <br></br>
      <h1>Data</h1>
      <table>
        <thead>
          <tr>
            {tableHeaders.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {coffeeData.map((coffee, index) => (
            <tr key={index}>
              {tableHeaders.map((header, index) => (
                <td key={index}>{coffee[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <br></br>
      <h1>Inputs</h1>
      <div>
        <input
          type="text"
          placeholder="Coffe name"
          value={newCoffee.name}
          onChange={(e) => setNewCoffee({ ...newCoffee, name: e.target.value })}
        />
      </div>
      <div>
        <input
          type="date"
          value={newCoffee.arrival_date}
          onChange={(e) =>
            setNewCoffee({ ...newCoffee, arrival_date: e.target.value })
          }
        />
      </div>
      <div>
        {newProperties.map((property, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Property key"
              value={property.key}
              onChange={(e) => handlePropertyChange(index, e)}
              name="key"
            />
            <input
              type="text"
              placeholder="Property value"
              value={property.value}
              onChange={(e) => handlePropertyChange(index, e)}
              name="value"
            />
          </div>
        ))}
        <button onClick={handleAddProperty}>Add Property</button>
      </div>
      <br></br>
      <button onClick={handleAddCoffee}>Add Coffee</button>
    </div>
  );
}

export default DynamoPage;
