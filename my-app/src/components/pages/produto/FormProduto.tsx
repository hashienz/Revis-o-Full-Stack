import React, { useState } from 'react';
import { api } from '../../../api'; 

interface FormProdutoProps {
  onProdutoCadastrado: () => void; 
}

// 2. Receba a prop
export function FormProduto({ onProdutoCadastrado }: FormProdutoProps) {
  // Seus states do formulário (nome, preco, etc.)
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState(0);
  const [estoque, setEstoque] = useState(0);
  const [categoriaId, setCategoriaId] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const novoProduto = { nome, preco, estoque, categoriaId };
      // Usando 'produtos' na rota POST (mais convencional)
      await api.post('/produtos', novoProduto); 
      
      alert('Produto cadastrado com sucesso!');
      
      onProdutoCadastrado(); 

      
      setNome('');
      setPreco(0);
      setEstoque(0);
      setCategoriaId(1);

    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      alert('Erro ao cadastrar. Verifique a Categoria ID.');
    }
  };

  return (
    <div>
      <h2>Cadastrar Produto</h2>
      <form onSubmit={handleSubmit}>
        {       }
        <input type="text" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} required />
        <input type="number" placeholder="Preço" value={preco} onChange={e => setPreco(parseFloat(e.target.value))} required />
        <input type="number" placeholder="Estoque" value={estoque} onChange={e => setEstoque(parseInt(e.target.value))} required />
        <input type="number" placeholder="Categoria ID" value={categoriaId} onChange={e => setCategoriaId(parseInt(e.target.value))} required />
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}