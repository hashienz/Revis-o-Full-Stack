export interface Categoria {
  id: number;
  nome: string;
}

export interface Produto {
  id?: number;
  nome: string;
  preco: number;
  estoque: number;
  categoriaId: number;
  categoria?: Categoria;
}
