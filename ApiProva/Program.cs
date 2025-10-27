using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDataContext>();

builder.Services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options =>
{
    options.SerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});

builder.Services.AddCors(options =>
    options.AddPolicy("Acesso Total",
        configs => configs
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod())
);

var app = builder.Build();


// ====================== CATEGORIAS ======================

app.MapGet("/categorias", async (AppDataContext db) =>
    await db.Categorias.ToListAsync());

app.MapPost("/categorias", async (AppDataContext db, Categoria categoria) =>
{
    db.Categorias.Add(categoria);
    await db.SaveChangesAsync();
    return Results.Created($"/categorias/{categoria.Id}", categoria);
});

// ====================== PRODUTOS ======================

app.MapGet("/produtos", async (AppDataContext db) =>
    await db.Produtos.Include(p => p.Categoria).ToListAsync());

app.MapPost("/produtos", async (AppDataContext db, Produto produto) =>
{
    db.Produtos.Add(produto);
    await db.SaveChangesAsync();
    return Results.Created($"/produtos/{produto.Id}", produto);
});

app.MapPut("/produtos/{id}", async (AppDataContext db, int id, Produto produtoAtualizado) =>
{
    var produto = await db.Produtos.FindAsync(id);
    if (produto is null) return Results.NotFound();

    produto.Nome = produtoAtualizado.Nome;
    produto.Preco = produtoAtualizado.Preco;
    produto.Estoque = produtoAtualizado.Estoque;
    produto.CategoriaId = produtoAtualizado.CategoriaId;

    await db.SaveChangesAsync();
    return Results.Ok(produto);
});

app.MapDelete("/produtos/{id}", async (AppDataContext db, int id) =>
{
    var produto = await db.Produtos.FindAsync(id);
    if (produto is null) return Results.NotFound();

    db.Produtos.Remove(produto);
    await db.SaveChangesAsync();
    return Results.Ok();
});

app.UseCors("Acesso Total");

app.Run();

