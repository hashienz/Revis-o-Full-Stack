import { useState } from "react";
import { api } from "../../../api";

export function FormProduto() {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState(0);
  const [estoque, setEstoque] = useState(0);
  const [categoriaId, setCategoriaId] = useState(1);

  async function salvar() {
    await api.post("/produtos", { nome, preco, estoque, categoriaId });
    alert("Produto cadastrado com sucesso!");
  }

  return (
    <div>
      <h2>Cadastrar Produto</h2>
      <input placeholder="Nome" onChange={(e) => setNome(e.target.value)} />
      <input
        type="number"
        placeholder="Preço"
        onChange={(e) => setPreco(Number(e.target.value))}
      />
      <input
        type="number"
        placeholder="Estoque"
        onChange={(e) => setEstoque(Number(e.target.value))}
      />
      <input
        type="number"
        placeholder="Categoria ID"
        onChange={(e) => setCategoriaId(Number(e.target.value))}
      />
      <button onClick={salvar}>Salvar</button>
    </div>
  );
}
