// 1. Importamos os hooks e tipos necessários
import React, { useState, useEffect } from "react";
import { Produto } from "./models/Produto"; 
import { api } from "./api"; 

import { FormProduto } from "./components/pages/produto/FormProduto";
import { ListaProdutos } from "./components/pages/produto/ListaProdutos";

function App() {
  // 2. O State (a lista) agora mora aqui no App.tsx
  const [produtos, setProdutos] = useState<Produto[]>([]);

  // 3. A função de buscar os dados também mora aqui
  const buscarProdutos = () => {
    api.get("/produtos")
      .then((res) => {
        setProdutos(res.data);
      })
      .catch(err => console.error("Erro ao buscar produtos:", err));
  };

  // 4. Usamos o useEffect para buscar a lista inicial quando o App carregar
  useEffect(() => {
    buscarProdutos();
  }, []); // O array vazio [] faz isso rodar só uma vez, no início

  return (
    <div id="app" style={{ padding: "20px" }}>
      <h1>Mini E-commerce</h1>
      
      {/* 5. Passamos a FUNÇÃO de buscar para o FormProduto.
           Quando o FormProduto cadastrar, ele vai chamar essa função.
      */}
      <FormProduto onProdutoCadastrado={buscarProdutos} />
      
      <hr style={{ margin: "20px 0" }} />
      
      {/* 6. Passamos a LISTA (o state) para o ListaProdutos.
           Ele não busca mais, só exibe o que recebe.
      */}
      <ListaProdutos produtos={produtos} />
    </div>
  );
}

export default App;