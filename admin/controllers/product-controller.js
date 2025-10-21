


// add product
const addProduct = async (req, res) => {
  try { } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: error.message });
  }
};

const getProducts = async (req, res) => {
  try { } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: error.message });
  }
};

const removeProduct = async (req, res) => {
  try { } catch (error) {
    console.error('Error removing product:', error);
    res.status(500).json({ message: error.message });
  }
};

const getOneProduct = async (req, res) => {
  try { } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: error.message });
  }
};

export { addProduct, getProducts, removeProduct, getOneProduct };