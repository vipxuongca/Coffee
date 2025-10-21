APIs endpoints:

POST /api/admin/register
POST /api/admin/login


const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: Array, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  weight: { type: Array, required: true },
  bestseller: { type: Boolean },
  date: { type: Number, required: true }
})