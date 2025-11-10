// Controlador para procesar el checkout de compras
const create = async (req, res) => {
  try {
    // Respuesta exitosa del procesamiento de compra
    // Retorna confirmación junto con datos del carrito y usuario
    return res.json({
      message: "Checkout successful",
      cart: req.body,    // Datos del carrito enviados desde el frontend
      user: req.user,    // Datos del usuario autenticado (desde middleware)
    });
  } catch (error) {
    // Manejo de errores del servidor
    // console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Exportación del controlador de checkout
export const checkoutController = {
  create, // Método para crear/procesar checkout
};
