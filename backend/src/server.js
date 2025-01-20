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
    logout,
    register,
    userGet,
    userAdminChange,
    userUpdate,
    getSubjects,
    setSubjects,
  } from './service';

const app = express()

app.use(cors()); //  allow any incoming HTTP requests from any origin to access the server's resources
app.use(express.urlencoded({ extended: true, }));
app.use(express.json({ limit: '500mb', }));

// function wrapper that performs HTTP requests and catches any errors and manages asynchronous behaviour
const performRequest = fn => async (req, res) => {
    try {
      await fn(req, res);
      save();
    } catch (err) {
      if (err instanceof InputError) {
        res.status(400).send({ error: err.message, });
      } else if (err instanceof AccessError) {
        res.status(403).send({ error: err.message, });
      } else {
        console.log(err);
        res.status(500).send({ error: 'A system error ocurred', });
      }
    }
  };

/***************************************************************
                       Auth Functions
***************************************************************/

const authed = (fn) => async (req, res) => {
    const userId = getUserIdFromAuthorization(req.header("Authorization"));
    await fn(req, res, userId);
};

app.post(
    "/admin/auth/login",
    performRequest(async (req, res) => {
      const { email, password } = req.body;
      const token = await login(email, password);
      return res.json({ token });
    })
  );
  

app.post(
    "/admin/auth/register",
    performRequest(async (req, res) => {
        const { email, password, name } = req.body;
        const token = await register(email, password, name);
        return res.json({ token });
    })
);

app.post(
    "/admin/auth/logout",
    performRequest(
        authed(async (req, res, email) => {
          console.log("Server logout", email)
          await logout(email);
          return res.json({});
        })
    )
);

/***************************************************************
                    Subject Functions
***************************************************************/

app.get(
    "/subjects",
    performRequest(
      authed(async (req, res, authUserId) => {
        const subjects = await getSubjects(authUserId);
        return res.json({ subjects });
      })
    )
  );

app.put(
    "/subjects",
    performRequest(
        authed(async (req, res, authUserId) => {
          await setSubjects(authUserId, req.body.subjects);
          return res.json({});
        })
    )
);

/***************************************************************
                    User Functions
***************************************************************/


app.get(
  "/user",
  performRequest(
    authed(async (req, res, authUserId) => {
      await userGet(authUserId)
      .then(data => {
        res.json(data); // Respond to the client with the data
      })
      .catch(data => {
        console.error(data);
        data.status(500).json({ error: "An error occurred while fetching user data." });
      })
  }
)));

/***************************************************************
                       Running Server
***************************************************************/

app.get("/api", (req, res) => {
    res.json({"users": ["jason", "jayden", "goran", "vahin"]})
})

const PORT = 5005
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})