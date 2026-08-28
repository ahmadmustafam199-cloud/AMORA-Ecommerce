import { Routes, Route } from "react-router-dom";

import Dashboard from "./Dashboard";
import AllProducts from "./AllProducts";
import AddProduct from "./AddProduct";

function Admin() {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="AllProducts" element={<AllProducts />} />
      <Route path="AddProduct" element={<AddProduct />} />
    </Routes>
  );
}

export default Admin;