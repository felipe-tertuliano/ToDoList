using BackEnd.Source;
using BackEnd.Source.Contexts;
using BackEnd.Source.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

/* #region dependency injection */

builder.Services.AddDbContext<TaskDBContext>();
builder.Services.AddControllers().AddJsonOptions(jo =>
{
    jo.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
});

/* #endregion */

builder.Services.AddEndpointsApiExplorer();

/* #region configure swagger */

builder.Services.AddSwaggerGen().AddSwaggerGen(sgo =>
{
    sgo.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Scheme = "Bearer",
        Type = SecuritySchemeType.ApiKey,
    });

    sgo.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

/* #endregion */

/* #region configure auth */

var key = Encoding.ASCII.GetBytes(Settings.Secret);
builder.Services.AddAuthentication(ao =>
{
    ao.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    ao.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(jbo =>
{
    jbo.RequireHttpsMetadata = false;
    jbo.SaveToken = true;
    jbo.TokenValidationParameters = new TokenValidationParameters
    {
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateAudience = false,
        ValidateIssuer = false,
        ValidateIssuerSigningKey = true
    };
});

/* #endregion */

/* #region configure CORS */

builder.Services.AddCors(p => p.AddPolicy("corsapp", builder =>
{
    builder.WithOrigins("*").AllowAnyMethod().AllowAnyHeader();
}));

/* #endregion */

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("corsapp");
app.UseAuthorization();

app.MapControllers();

app.Run();
