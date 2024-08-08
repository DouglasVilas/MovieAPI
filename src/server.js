require("express-async-errors");
const database = require("./database/sqlite");
const  migrationsRun = require("./database/sqlite/migrations");
const AppError = require("./utils/AppError");
const express = require("express");  // importou express
const routes = require("./routes");

migrationsRun(); 

const app = express(); // iniciou o express
app.use(express.json());

app.use(routes);

app.use((error, request, response, next) => {
    if (error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        }); 
    }

    console.error(error);
    
    return response.status(500).json({
        status: "error",
        message: "Internal server error"
    });

});

const PORT = 3334; //criou um constância e a porta que vai ser usado
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`)); //listen e tipo escutando quando ela executar vai rodar a mensagem do console.log (terminal)

//parei na aula executando a aplicação 