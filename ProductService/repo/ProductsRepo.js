const {ProductModel}=require('../../ProductService/models/index')


class ProductsRepo{
  async Products() {
    try {
      return await ProductModel.find();
    } catch (err) {
      console.log('unable to find products')
    }
  }

  async CreateProduct({
    name,
    desc,
    type,
    unit,
    price,
    available,
    suplier,
    banner,
  }) {
    try {
      const product = new ProductModel({
        name,
        desc,
        type,
        unit,
        price,
        available,
        suplier,
        banner,
      });

      const productResult = await product.save();
      return productResult;
    } catch (err) {
      throw new Error(
        "Unable to Create Product"
      );
    }
  }

  async FindById(id) {
    try {
      return await ProductModel.findById(id);
    } catch (err) {
      throw new Error(
        "Unable to Find Product"
      );
    }
  }

}

module.exports=ProductsRepo