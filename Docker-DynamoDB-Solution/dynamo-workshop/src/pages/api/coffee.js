// pages/api/coffee.js

import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { fetchRecords, insertRecords } from "../utils/awsHandler";

// Function to insert a new coffee brand into the DynamoDB table
const insertCoffeeBrand = async (coffeeBrand) => {
  const params = {
    TableName: "CoffeeBase",
    Item: marshall(coffeeBrand),
  };

  try {
    const response = await insertRecords(params)
    console.log("Coffee added:", coffeeBrand);
    return response;
  } catch (error) {
    console.error("Error adding coffee:", error);
    throw error;
  }
};

// Function to retrieve all coffee brands from the DynamoDB table
const getAllCoffeeBrands = async () => {
  const params = {
    TableName: "CoffeeBase",
  };

  try {
    const response = await fetchRecords(params)
    return response.Items.map((item) => unmarshall(item));
  } catch (error) {
    console.error("Error getting coffee:", error);
    throw error;
  }
};

const handler = async (req, res) => {
  if (req.method === "GET") {
    // Handle GET request to retrieve coffee brands
    try {
      const coffeeBrands = await getAllCoffeeBrands();
      res.status(200).json(coffeeBrands);
    } catch (error) {
      res.status(500).json({ error: "Unable to retrieve coffee brands" });
    }
  } else if (req.method === "POST") {
    // Handle POST request to add a new coffee brand
    try {
      const coffeeBrand = {
        ...req.body
      };
      await insertCoffeeBrand(coffeeBrand);
      res.status(201).json({ message: "Coffee brand added successfully" });
    } catch (error) {
      res.status(500).json({ error: "Unable to add coffee brand" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
