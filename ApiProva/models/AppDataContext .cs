using Microsoft.EntityFrameworkCore;

public class AppDataContext : DbContext
{
    public DbSet<Produto> Produtos => Set<Produto>();  
    public DbSet<Categoria> Categorias => Set<Categoria>();

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source=Revisao.db");
        
    }


}