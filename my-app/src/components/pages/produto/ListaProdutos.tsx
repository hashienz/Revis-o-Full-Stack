import React from "react"; 
import { Produto } from "../../../models/Produto";

interface ListaProdutosProps {
  produtos: Produto[];
}

export function ListaProdutos({ produtos }: ListaProdutosProps) {

  return (
    <div>
      <h2>Lista de Produtos</h2>

      { }
      {produtos.length === 0 ? (
        <p>Nenhum produto cadastrado ainda.</p>
      ) : (
        <ul>
          {}
          {produtos.map((p) => (
            <li key={p.id}>
              {p.nome} — R$ {p.preco.toFixed(2)} ({p.categoria?.nome})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}