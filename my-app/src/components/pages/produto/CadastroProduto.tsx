import { useState } from "react";
import { api } from "../../../api";

export function Produto() {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");
  const [categoriaId, setCategoriaId] = useState("");

  const salvar = async () => {
    try {
      const novoProduto = {
        nome,
        preco: parseFloat(preco),
        estoque: parseInt(estoque),
        categoriaId: parseInt(categoriaId)
      };

      await api.post("/produtos/cadastrar", novoProduto);
      alert("Produto cadastrado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao cadastrar produto:", error);
      alert("Erro ao cadastrar produto!");
    }
  };

  return (
    <div>
      <h2>Cadastrar Produto</h2>
      <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
      <input placeholder="Preço" value={preco} onChange={e => setPreco(e.target.value)} />
      <input placeholder="Estoque" value={estoque} onChange={e => setEstoque(e.target.value)} />
      <input placeholder="Categoria ID" value={categoriaId} onChange={e => setCategoriaId(e.target.value)} />
      <button onClick={salvar}>Salvar</button>
    </div>
  );
}
