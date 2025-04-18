const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  body: String,
  title: String,
  postDate: Date,
  featureImage: String,
  published: Boolean,
  price: Number,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }
});

const categorySchema = new mongoose.Schema({
  category: String
});

let Item;
let Category;

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    const db = mongoose.createConnection(
      "mongodb+srv://tamyaludhav:hastenRock@cluster0.07sdrlo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );

    db.on("error", err => reject(err));
    db.once("open", () => {
      Item = db.model("Item", itemSchema);
      Category = db.model("Category", categorySchema);
      resolve();
    });
  });
};

module.exports.getAllItems = () => Item.find().populate("category").exec();

module.exports.getPublishedItems = () => Item.find({ published: true }).populate("category").exec();

module.exports.getPublishedItemsByCategory = (categoryId) =>
  Item.find({ published: true, category: categoryId }).populate("category").exec();

module.exports.getCategories = () => Category.find().exec();

module.exports.addItem = (itemData) => {
  itemData.published = !!itemData.published;
  for (let key in itemData) {
    if (itemData[key] === "") itemData[key] = null;
  }
  itemData.postDate = new Date();
  return new Item(itemData).save();
};

module.exports.getItemsByCategory = (categoryId) =>
  Item.find({ category: categoryId }).populate("category").exec();

module.exports.getItemsByMinDate = (minDateStr) =>
  Item.find({ postDate: { $gte: new Date(minDateStr) } }).populate("category").exec();

module.exports.getItemById = (id) =>
  Item.findById(id).populate("category").exec();

module.exports.addCategory = (categoryData) => {
  for (let key in categoryData) {
    if (categoryData[key] === "") categoryData[key] = null;
  }
  return new Category(categoryData).save();
};

module.exports.deleteCategoryById = (id) => Category.findByIdAndDelete(id).exec();

module.exports.deletePostById = (id) => Item.findByIdAndDelete(id).exec();
