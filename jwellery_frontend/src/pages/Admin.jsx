import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Button, TextField, Grid, Card, CardMedia, CardContent, 
  Dialog, DialogTitle, DialogContent, DialogActions 
} from '@mui/material';

function Admin() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', description: '', image: null });
  const [editProduct, setEditProduct] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [editPreviewImage, setEditPreviewImage] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Fetch all products from backend
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // ✅ Handle file input change for new product
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewProduct({ ...newProduct, image: file });
    setPreviewImage(URL.createObjectURL(file));
  };

  // ✅ Add a new product
  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.description || !newProduct.image) {
      alert('All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('price', newProduct.price);
    formData.append('category', newProduct.category);
    formData.append('description', newProduct.description);
    formData.append('image', newProduct.image);

    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Product added successfully!');
        fetchProducts();
        // ✅ Reset form fields and remove preview
        setNewProduct({ name: '', price: '', category: '', description: '', image: null });
        setPreviewImage(null);
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  // ✅ Delete a product
  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });

      if (response.ok) {
        alert('Product deleted successfully!');
        fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // ✅ Open edit modal (Set edit state and preview image)
  const handleEdit = (product) => {
    setEditProduct(product);
    setEditPreviewImage(product.image);
    setOpenEditDialog(true);
  };

  // ✅ Handle edit input change
  const handleEditChange = (e) => {
    setEditProduct({ ...editProduct, [e.target.name]: e.target.value });
  };

  // ✅ Handle edit file change
  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    setEditProduct({ ...editProduct, image: file });
    setEditPreviewImage(URL.createObjectURL(file));
  };

  // ✅ Update product
  const updateProduct = async () => {
    const formData = new FormData();
    formData.append('name', editProduct.name);
    formData.append('price', editProduct.price);
    formData.append('category', editProduct.category);
    formData.append('description', editProduct.description);
    if (editProduct.image instanceof File) {
      formData.append('image', editProduct.image);
    }

    try {
      const response = await fetch(`http://localhost:5000/api/products/${editProduct._id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        alert('Product updated successfully!');
        fetchProducts();
        setOpenEditDialog(false);
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Admin Panel</Typography>

      {/* ✅ Grid Layout: Left - Product List (70%), Right - Add Product Form (30%) */}
      <Grid container spacing={3}>
        {/* ✅ Left Section: Product List (70%) */}
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom>Product List</Typography>
          <Grid container spacing={3}>
            {products.length === 0 ? (
              <Typography>No products available.</Typography>
            ) : (
              products.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product._id}>
                  <Card>
                    <CardMedia component="img" height="200" image={product.image} alt={product.name} />
                    <CardContent>
                      <Typography variant="h6">{product.name}</Typography>
                      <Typography variant="body1">₹{product.price}</Typography>
                      <Typography variant="body2">Category: {product.category}</Typography>
                      <Typography variant="body2">Description: {product.description}</Typography>
                      <Button color="primary" onClick={() => handleEdit(product)}>Edit</Button>
                      <Button color="secondary" onClick={() => deleteProduct(product._id)}>Delete</Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Grid>

        {/* ✅ Right Section: Add Product Form (30%) */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6">Add New Product</Typography>
          <TextField fullWidth margin="normal" label="Product Name" name="name" onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} value={newProduct.name} />
          <TextField fullWidth margin="normal" label="Price" name="price" type="number" onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} value={newProduct.price} />
          <TextField fullWidth margin="normal" label="Category" name="category" onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} value={newProduct.category} />
          <TextField fullWidth margin="normal" label="Description" name="description" multiline rows={3} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} value={newProduct.description} />
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {previewImage && <img src={previewImage} alt="Preview" style={{ width: '100px', marginTop: '10px' }} />}
          <Button variant="contained" color="primary" onClick={addProduct}>Add Product</Button>
        </Grid>
      </Grid>

      {/* ✅ Edit Product Dialog */}
      {editProduct && (
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogContent>
            <TextField fullWidth margin="normal" label="Product Name" name="name" onChange={handleEditChange} value={editProduct.name} />
            <TextField fullWidth margin="normal" label="Price" name="price" type="number" onChange={handleEditChange} value={editProduct.price} />
            <TextField fullWidth margin="normal" label="Category" name="category" onChange={handleEditChange} value={editProduct.category} />
            <TextField fullWidth margin="normal" label="Description" name="description" multiline rows={3} onChange={handleEditChange} value={editProduct.description} />
            <input type="file" accept="image/*" onChange={handleEditFileChange} />
            {editPreviewImage && <img src={editPreviewImage} alt="Preview" style={{ width: '100px', marginTop: '10px' }} />}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
            <Button onClick={updateProduct} color="primary">Update</Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
}

export default Admin;
