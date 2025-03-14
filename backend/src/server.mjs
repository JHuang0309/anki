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

import { InputError, AccessError, } from './error.mjs';
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
    getDecks,
    setDecks,
    createDeck,
    deleteDeck,
    getCards,
    createCard,
    getCard,
    updateCard,
    deleteCard,
  } from './service.mjs';

const app = express()

app.use(cors({
  origin: ['https://anki-frontend.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
})); //  allow any incoming HTTP requests from any origin to access the server's resources
// app.use(cors())
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
          console.log("Server logout", email);
          await logout(email);
          return res.json({});
        })
    )
);

/***************************************************************
                    Deck Functions
***************************************************************/

app.get(
    "/decks",
    performRequest(
      authed(async (req, res, authUserId) => {
        const decks = await getDecks(authUserId);
        return res.json({ decks });
      })
    )
  );

app.put(
    "/decks",
    performRequest(
        authed(async (req, res, authUserId) => {
          await setDecks(authUserId, req.body.decks);
          return res.json({});
        })
    )
);

app.post(
  "/create/deck",
  performRequest(
      authed(async (req, res, authUserId) => {
        await createDeck(authUserId, req.body.title);
        return res.json({});
      })
  )
);

app.delete(
  "/delete/deck",
  performRequest(
    authed(async (req, res, authUserId) => {
      const { deckId } = req.query;
      deleteDeck(authUserId, deckId);
      return res.json({});
    })
  )
);

/***************************************************************
                    Card Functions
***************************************************************/

app.get(
  "/cards",
  performRequest(
    authed(async (req, res, authUserId) => {
      const deckId = req.query.deckId;
      const cards = await getCards(authUserId, deckId);
      return res.json({ cards });
    })
  )
);

app.get(
  "/card",
  performRequest(
    authed(async (req, res, authUserId) => {
      const cardId = req.query.cardId;
      const card = await getCard(authUserId, cardId);
      return res.json({ card });
    })
  )
);

app.post(
  "/create/card",
  performRequest(
      authed(async (req, res, authUserId) => {
        await createCard(authUserId, req.body);
        return res.json({});
      })
  )
);

app.put(
  "/update/card",
  performRequest(
      authed(async (req, res, authUserId) => {
        updateCard(authUserId, req.body);
        return res.json({});
      })
  )
);

app.delete(
  "/delete/card",
  performRequest(
    authed(async (req, res, authUserId) => {
      const { cardId } = req.query;
      deleteCard(authUserId, cardId);
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

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})