import { useEffect, useState } from "react";
import { api } from "../../../api";
import { Produto } from "../../../models/Produto";

export function ListaProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    api.get("/produtos").then((res) => setProdutos(res.data));
  }, []);

  return (
    <div>
      <h2>Lista de Produtos</h2>
      <ul>
        {produtos.map((p) => (
          <li key={p.id}>
            {p.nome} — R$ {p.preco.toFixed(2)} ({p.categoria?.nome})
          </li>
        ))}
      </ul>
    </div>
  );
}
