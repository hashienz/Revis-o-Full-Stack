import React from "react";
import { FormProduto } from "./components/pages/produto/FormProduto";
import { ListaProdutos } from "./components/pages/produto/ListaProdutos";

function App() {
  return (
    <div id="app">
      <h1>Mini E-commerce</h1>
      <FormProduto />
      <hr />
      <ListaProdutos />
    </div>
  );
}

export default App;
