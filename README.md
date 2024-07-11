# ToDoList

---

## Data Base

#### folder
./data-base

#### diagram
![Database diagram](/assets/database-diagram.png "Database diagram")

---

## Back End

#### folder
./back-end

#### config
| Name             | Source                      | Value                                                                      |
| ---------------- | --------------------------- | -------------------------------------------------------------------------- |
| ConnectionString | .\back-end\appsettings.json | "Server=localhost;Port=5432;Database=TaskDB;User Id=admin;Password=admin;" |

#### start up commands
```
cd ./back-end
dotnet run --launch-profile BackEnd
```

#### diagram
![Backend diagram](/assets/backend-diagram.png "Backend diagram")

---

## Front End

#### folder
./froont-end

#### config
| Name    | Source                          | Value                    |
| --------| ------------------------------- | ------------------------ |
| baseURL | .\front-end\src\services\api.ts | "https://localhost:7173" |

#### start up commands
```
cd ./front-end
npm i
npm start
```

#### diagram
![Frontend diagram](/assets/frontend-diagram.png "Frontend diagram")