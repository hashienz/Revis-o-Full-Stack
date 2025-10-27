# Template Full-Stack: C# (.NET 8) API + React (TypeScript)

Este projeto é um template básico para uma aplicação Full-Stack, servindo como material de revisão. Ele implementa um "Mini E-commerce" com cadastro de Produtos e Categorias.

-   **Back-end:** API Mínima (Minimal API) em C# (.NET 8), Entity Framework Core e SQLite.
-   **Front-end:** React com TypeScript, utilizando `useState`, `useEffect` e `axios` (ou um wrapper `api.ts`).

---

## Conceitos Principais (Revisão para a Prova)

Este template demonstra conceitos cruciais de desenvolvimento full-stack:

### 1. Back-end (C# / .NET)

-   **Injeção de Dependência (DI):** Configuração do `DbContext` e do `CORS` no `Program.cs` usando `builder.Services`.
-   **Endpoints Mínimos (Minimal API):** Criação de rotas `MapGet`, `MapPost`, `MapPut` e `MapDelete` de forma direta.
-   **Entity Framework (EF Core):**
    -   Uso do `Include()` para carregar dados relacionados (JOIN do SQL).
    -   Tratamento de **Erro de Chave Estrangeira (Foreign Key):** O erro `FOREIGN KEY constraint failed` que ocorre ao tentar cadastrar um `Produto` com uma `CategoriaId` que não existe.
    -   Tratamento de **Referência Circular (JSON Loop):** O erro `500 Internal Server Error` que ocorre ao usar `.Include()`. A correção é configurar o `ReferenceHandler.IgnoreCycles` no `Program.cs`.
-   **CORS (Cross-Origin Resource Sharing):** A política `AllowAnyOrigin` é essencial em desenvolvimento para permitir que o `localhost:3000` (React) acesse o `localhost:5122` (C#).

### 2. Front-end (React / TS)

-   **Elevação de Estado (Lifting State Up):** Este é o conceito **mais importante** do front-end.
    -   O "dono" da lista de produtos não é o `ListaProdutos.tsx`.
    -   O "dono" é o componente pai, `App.tsx`.
    -   `App.tsx` guarda o `state` (`const [produtos, setProdutos] = useState(...)`).
    -   `App.tsx` possui a função de buscar os dados (`buscarProdutos()`).
-   **Comunicação entre Componentes-Irmãos:**
    -   Como o `FormProduto` (irmão) "avisa" o `ListaProdutos` (irmão) que um novo item foi cadastrado?
    -   **Resposta:** Ele não avisa! O `FormProduto` chama uma função que recebeu por `props` (`onProdutoCadastrado`). Essa função, na verdade, é a `buscarProdutos()` do `App.tsx`. Ao ser chamada, ela atualiza o `state` no `App.tsx`, que por sua vez re-renderiza o `ListaProdutos` com a nova lista.
-   **Hooks do React:**
    -   `useState`: Para guardar o estado da lista de produtos e dos campos do formulário.
    -   `useEffect`: Para buscar os dados da API **apenas uma vez**, quando o componente `App.tsx` é carregado (usando o array de dependências `[]`).
-   **Componentes "Burros" vs. "Inteligentes":**
    -   `App.tsx` é "inteligente": ele gerencia o estado e a lógica de API.
    -   `ListaProdutos.tsx` é "burro": ele apenas recebe `props` (`produtos`) e as exibe.

---

## Estrutura do Projeto (Exemplo)

## Como Rodar o Projeto

### 1. Back-end (C#)

1.  Navegue até a pasta do back-end: `cd backend-api`
2.  (Se for a primeira vez) Crie e aplique as migrações do banco:
    ```bash
    dotnet ef migrations add InitialCreate
    dotnet ef database update
    ```
3.  Inicie a API:
    ```bash
    dotnet run
    ```
4.  A API estará disponível em `http://localhost:5122` (ou a porta definida no `launchSettings.json`).

### 2. Front-end (React)

1.  Navegue até a pasta do front-end: `cd frontend-react`
2.  (Se for a primeira vez) Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie a aplicação React:
    ```bash
    npm run dev
    ```
4.  O aplicativo estará disponível em `http://localhost:3000`.

---

## Pontos-Chave do Código (Template)

### Back-end: `Program.cs` (Configuração)

```csharp
// ...
var builder = WebApplication.CreateBuilder(args);

// 1. Configura o Banco de Dados (ex: SQLite)
builder.Services.AddDbContext<AppDataContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// 2. CORRIGE O ERRO 500 (Loop de JSON) AO USAR .Include()
builder.Services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options =>
{
    options.SerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});

// 3. Configura o CORS para o React (desenvolvimento)
builder.Services.AddCors(options =>
    options.AddPolicy("Acesso Total",
        configs => configs
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod())
);

var app = builder.Build();

// ...
// 4. Endpoint GET com .Include()
app.MapGet("/produtos", async (AppDataContext db) =>
    await db.Produtos.Include(p => p.Categoria).ToListAsync());
// ...

app.UseCors("Acesso Total"); // Não esquecer de USAR o CORS
app.Run();

import React, { useState, useEffect } from "react";
import { Produto } from "./models/Produto";
import { api } from "./api";
import { FormProduto } from "./components/pages/produto/FormProduto";
import { ListaProdutos } from "./components/pages/produto/ListaProdutos";

function App() {
  // O "dono" do estado da lista
  const [produtos, setProdutos] = useState<Produto[]>([]);

  // A função de busca
  const buscarProdutos = () => {
    api.get("/produtos")
      .then((res) => setProdutos(res.data))
      .catch(err => console.error("Erro ao buscar:", err));
  };

  // Busca os dados iniciais
  useEffect(() => {
    buscarProdutos();
  }, []);

  return (
    <div id="app">
      <h1>Mini E-commerce</h1>

      {/* 1. Passa a *função* para o formulário saber como "avisar" o App */}
      <FormProduto onProdutoCadastrado={buscarProdutos} />
      <hr />

      {/* 2. Passa o *estado* para a lista saber o que exibir */}
      <ListaProdutos produtos={produtos} />
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import { api } from '../../../api';

// 1. Define a prop que vai receber
interface FormProdutoProps {
  onProdutoCadastrado: () => void;
}

// 2. Recebe a prop
export function FormProduto({ onProdutoCadastrado }: FormProdutoProps) {
  const [nome, setNome] = useState('');
  // ... outros states do form ...

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const novoProduto = { nome, /*...*/ };
      await api.post('/produtos', novoProduto);
      
      alert('Cadastrado!');
      
      // 3. CHAMA A FUNÇÃO DO PAI (App.tsx)
      onProdutoCadastrado(); 

      // 4. Limpa o formulário
      setNome('');

    } catch (error) {
      alert('Erro ao cadastrar.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... inputs ... */}
      <button type="submit">Salvar</button>
    </form>
  );
}
import React from "react";
import { Produto } from "../../../models/Produto";

// 1. Define a prop que vai receber
interface ListaProdutosProps {
  produtos: Produto[];
}

// 2. Recebe a prop (e não tem mais useState/useEffect)
export function ListaProdutos({ produtos }: ListaProdutosProps) {
  return (
    <div>
      <h2>Lista de Produtos</h2>
      {produtos.length === 0 ? (
        <p>Nenhum produto cadastrado.</p>
      ) : (
        <ul>
          {/* 3. Apenas renderiza o que recebeu */}
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
