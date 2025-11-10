// Importación del modelo de pizzas
import { pizzaModel } from "../models/pizza.model.js";

// Controlador para obtener todas las pizzas
const readPizzas = async (req, res) => {
  // Obtiene todas las pizzas desde el modelo y las retorna
  const pizzas = await pizzaModel.getPizzas();
  res.json(pizzas);
};

// Controlador para obtener una pizza específica por ID
const readPizza = async (req, res) => {
  // Extrae el ID de los parámetros de la URL
  const { id } = req.params;
  
  // Busca la pizza convirtiendo el ID a minúsculas para consistencia
  const pizza = await pizzaModel.getPizza(id.toLowerCase());
  
  // Manejo de caso cuando la pizza no existe
  if (!pizza) {
    return res.status(404).json({ message: "Pizza not found" });
  }
  
  // Retorna la pizza encontrada
  res.json(pizza);
};

// Exportación del controlador de pizzas
export const pizzaController = {
  readPizzas, // Método para obtener todas las pizzas
  readPizza,  // Método para obtener una pizza específica
};
