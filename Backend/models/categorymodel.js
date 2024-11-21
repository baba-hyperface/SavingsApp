import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  icon: {
    type: String,
    required: true, 
  },
  backgroundColor: {
    type: String,
  },
  shape: {
    type: String,
    default:"",
    enum: ["circle", "square", "hexagon","cave","den","star","msg",""],
  },
  iconType: {
    type: String,
    default:""
  },
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
