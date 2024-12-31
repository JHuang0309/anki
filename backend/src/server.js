/**************************************************************************************/
/**********  SERVER FUNCIONTALITY FILE  **********************************************
*      
*      File to manage requests made to the server 
*
/*************************************************************************************/
import fs from 'fs';
import express from 'express';
// import swaggerUi from 'swagger-ui-express';
import cors from 'cors';

import { InputError, AccessError, } from './error';
import {
    save,
    reset,
    assertValidUserId,
    assertAdminUserId,
    getUserIdFromAuthorization,
    getUserIdFromEmail,
    login,
    register,
    userGet,
    userAdminChange,
    userUpdate,
  } from './service';

const app = express()

app.use(cors()); //  allow any incoming HTTP requests from any origin to access the server's resources

app.get("/api", (req, res) => {
    res.json({"users": ["jason", "jayden", "goran", "vahin"]})
})

const PORT = 5005
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})