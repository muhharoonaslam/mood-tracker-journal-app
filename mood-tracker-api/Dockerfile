FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY MoodTrackerApi.csproj .
RUN --mount=type=cache,target=/root/.nuget/packages dotnet restore
COPY . .
RUN --mount=type=cache,target=/root/.nuget/packages dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8000
ENV ASPNETCORE_ENVIRONMENT=Production
ENTRYPOINT ["dotnet", "MoodTrackerApi.dll"]
