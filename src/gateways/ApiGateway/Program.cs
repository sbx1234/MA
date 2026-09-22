var builder = WebApplication.CreateBuilder(args);

// ===== CORS (para el frontend) =====
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ===== YARP Reverse Proxy =====
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

var app = builder.Build();

app.UseCors("AllowFrontend");

// Mapea las rutas configuradas en appsettings.json
app.MapReverseProxy();

app.Run();