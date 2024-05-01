// pages/api/coffee.js

import { unmarshall } from "@aws-sdk/util-dynamodb";
import { queryByParams } from "../utils/awsHandler";

// TODO Fix this
const getCoffeeByPrice = async (name, maxPrice) => {
  try {
    const params = {
      TableName: "CoffeeBase",
      IndexName: "CoffeePriceIndex",
      KeyConditionExpression: "#name = :name AND #price <= :price", // Adjusted for "greater than" query
      ExpressionAttributeNames: {
        "#name": "name",
        "#price": "price",
      },
      ExpressionAttributeValues: {
        ":name": { S: name },
        ":price": { N: maxPrice }, // Replace "your-desired-price" with the price value you want to filter by
      },
    }
    const response = await queryByParams(params)
    return response.Items.map((item) => unmarshall(item));
  } catch (error) {
    console.error("Error getting coffee price:", error);
    throw error;
  }
};

const handler = async (req, res) => {
  if (req.method === "GET") {
    // Handle GET request to retrieve coffee brands
    try {
      const { name, maxPrice } = req.query;
      const coffeeBrands = await getCoffeeByPrice(name, maxPrice);
      res.status(200).json(coffeeBrands);
    } catch (error) {
      res.status(500).json({ error: "Unable to retrieve coffee brands" });
    }
  }
};

export default handler;
