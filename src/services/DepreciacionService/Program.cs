using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using DepreciacionService.Data;
using DepreciacionService.Services;

var builder = WebApplication.CreateBuilder(args);

// ===== Base de datos =====
builder.Services.AddDbContext<DepreciacionDbContext>(opciones =>
    opciones.UseSqlServer(
        builder.Configuration.GetConnectionString("ConexionBD")
    )
);

// ===== Servicios =====
builder.Services.AddScoped<CalculoDepreciacionService>();

// ===== CORS =====
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ===== JWT (mismo key que UsuariosService) =====
var jwtKey = builder.Configuration["Jwt:Key"] ?? "clave-secreta-depreciacion-ecuador-2026-muy-larga-y-segura";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opciones =>
    {
        opciones.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey)
            )
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// app.UseHttpsRedirection();

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();