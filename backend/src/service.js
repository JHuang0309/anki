/**************************************************************************************/
/**********  SERVICE FUNCIONTALITY FILE  **********************************************
*      
*      File to manage backend data and provide functions and datastructures 
*      to operate on this data
*
/*************************************************************************************/
import fs from 'fs';
import jwt from 'jsonwebtoken';
import AsyncLock from 'async-lock'; // library used to ensure shared resources are managed appropriately
import { InputError, AccessError, } from './error.js';

const lock = new AsyncLock(); // creates an instance of a lock to manage access to shared resources

const JWT_KEY = 'supersecrettoken';
const DATABASE_FILE = './database.json'; // for now we'll use a local database through a .json file

/***************************************************************
                       State Management
***************************************************************/

let users = {};
let cards = {};
let decks = {};

const update = (users) =>
  // using a promise to manage asynchronous calling of 'await update()'
  new Promise((resolve, reject) => {
    // .acquire method ensures that only one function at a time can acquire the lock with key 'saveData'
    lock.acquire('saveData', () => {
      try {
        // write to the database.json file
        fs.writeFileSync(DATABASE_FILE, JSON.stringify({ 
          users,
          cards,
          decks,  
        }, null, 2));
        resolve();
      } catch {
        reject(new Error('Writing to database failed'));
      }
    });
  });

export const save = () => update(users);
export const reset = () => {
  update({}, {}, {}, {}); // clear the database.json file
  // reset global variables
  users = {};
  cards = {};
  decks = {};
};

// Load database contents into global variables upon start up
try {
  const data = JSON.parse(fs.readFileSync(DATABASE_FILE));
  users = data.users;
  cards = data.cards;
  decks = data.decks;
} catch {
  console.log('WARNING: No database found, create a new one');
  save();
}

/***************************************************************
                        Helper Functions
***************************************************************/

const newUserId = () => generateId(Object.keys(users));
const newCardId = () => generateId(Object.keys(cards));
const newDeckId = () => generateId(Object.keys(decks));

// wrapper for asynchronous function management - function needing thread-safe operation is passed in
const dataLock = callback => new Promise((resolve, reject) => {
  lock.acquire('dataLock', callback(resolve, reject));
});

const randNum = max => Math.round(Math.random() * (max - Math.floor(max / 10)) + Math.floor(max / 10));
const generateId = (currentList, max = 999999) => {
  let R = randNum(max).toString();
  while (currentList.includes(R)) {
    R = randNum(max).toString();
  }
  return parseInt(R);
};

/***************************************************************
                         Auth Functions
***************************************************************/

/**
 * Extracts and verifies the user ID from the Authorization HTTP header.
 *
 * @param {string} authorization - The Authorization header containing the Bearer token.
 * @returns {string} - The user ID from the decoded JWT token as a string.
 * @throws {AccessError} - If the token is invalid, expired, or the user ID is not found in the users collection.
 */
export const getUserIdFromAuthorization = authorization => {
  // Note: Authorization header comes in the format: 'Bearer myToken'
  const token = authorization.replace('Bearer ', '');
  try {
    const { userId, } = jwt.verify(token, JWT_KEY);
    if (!(userId in users)) {
      throw new AccessError(`Invalid token ${token}`);
    }
    return userId.toString();
  } catch {
    throw new AccessError(`Invalid token ${token}`);
  }
};

export const getUserIdFromEmail = email => {
  return Object.keys(users).find(id => users[id].email === email);
};

// asynchronous function (by using datalock wrapper) to login a user
// access token and user id object using 'login().then(res => ... )'
export const login = (email, password) => dataLock((resolve, reject) => {
  const userId = getUserIdFromEmail(email);
  if (userId !== undefined && users[userId].password === password) {
    // create a JSON web token with the JWT_KEY using a HS256 signing algorithm
    resolve({
      token: jwt.sign({ userId, }, JWT_KEY, { algorithm: 'HS256', }),
      userId: parseInt(userId, 10),
    });
  }
  reject(new InputError(`Invalid email ${email} or password ${password}`));
});

export const logout = (email) =>
  dataLock((resolve, reject) => {
    users[email].sessionActive = false;
    resolve();
  });

export const register = (email, password, name) => dataLock((resolve, reject) => {
  if (getUserIdFromEmail(email) !== undefined) {
    throw new InputError(`Email address ${email} already registered`);
  }
  const userId = newUserId();
  users[userId] = {
    email,
    name,
    password,
    image: null,
    admin: Object.keys(users).length === 0 ? true : false,
    decks: [],
    cards: [],
  };
  resolve({
    token: jwt.sign({ userId, }, JWT_KEY, { algorithm: 'HS256', }),
    userId: parseInt(userId, 10),
  });
});

/***************************************************************
                       Deck Functions
***************************************************************/

export const getDecks = (authUserId) =>
  dataLock((resolve, reject) => {
    resolve(users[authUserId].decks);
  });

export const setDecks = (authUserId, newDecks) =>
  dataLock((resolve, reject) => {
    users[authUserId].decks = newDecks;
    resolve();
  });

  export const createDeck = (authUserId, title) =>
    dataLock((resolve, reject) => {
      // console.log('Current decks', users[authUserId].decks);
      const deckLen = users[authUserId].decks.length;
      const newDeck = {
        id: newDeckId(),
        title: title,
        createdAt: new Date().toLocaleString(),
        numCards: '0',
      }
      users[authUserId].decks[deckLen] = (newDeck);
      resolve();
  });

  export const deleteDeck = (authUserId, deckId) => {
    dataLock((resolve, reject) => {
      users[authUserId].decks = users[authUserId].decks.filter(d => d.id !== +deckId);
      users[authUserId].cards = users[authUserId].cards.filter(c => c.deckId !== deckId);
      resolve();
    });
  }

/***************************************************************
                       Card Functions
***************************************************************/

export const getCards = (authUserId, deckId) =>
  dataLock((resolve, reject) => {
    resolve(users[authUserId].cards.filter(c => c.deckId === deckId).reverse());
  });

  export const getCard = (authUserId, cardId) =>
    dataLock((resolve, reject) => {

      resolve(users[authUserId].cards.filter(c => c.id === Number(cardId)));
  });

export const createCard = (authUserId, cardDetails) =>
  dataLock((resolve, reject) => {
    const newCard = {
      id: newCardId(),
      title: cardDetails.title,
      topic: cardDetails.topic,
      difficulty: cardDetails.difficulty,
      type: cardDetails.type,
      desc: cardDetails.desc,
      answer: cardDetails.answer,
      deckId: cardDetails.deckId,
      createdAt: new Date().toLocaleString(),
    }
    const cardsLen = users[authUserId].cards.length;
    users[authUserId].cards[cardsLen] = (newCard);
    resolve();
});

export const updateCard = (authUserId, cardDetails) => {
  dataLock((resolve, reject) => {
    const userCards = users[authUserId].cards;
    const cardIndex = userCards.findIndex(c => c.id === Number(cardDetails.id));
    if (cardIndex === -1) {
      return reject(new Error("Card not found"));
    }
    // Update card fields
    users[authUserId].cards[cardIndex] = { 
      ...users[authUserId].cards[cardIndex], 
      ...cardDetails 
    };

    resolve(users[authUserId].cards[cardIndex]);
})};

export const deleteCard = (authUserId, cardId) => {
  dataLock((resolve, reject) => {
    users[authUserId].cards = users[authUserId].cards.filter(c => c.id !== +cardId);
    resolve();
  });
}

/***************************************************************
                         User Functions
***************************************************************/

export const assertValidUserId = (userId) => dataLock((resolve, reject) => {
  if (!(userId in users)) {
    throw new InputError(`Invalid user ID ${userId}`);
  }
  resolve();
});

export const assertAdminUserId = (userId) => dataLock((resolve, reject) => {
  if (!users[userId].admin) {
    throw new InputError(`Invalid admin user ID ${userId}`);
  }
  resolve();
});

export const userGet = (userId) => dataLock((resolve, reject) => {
  const intid = parseInt(userId, 10);
  const user = {
    ...users[userId],
    password: undefined,
    id: intid,
  };
  resolve(user);
  // access  user object using 'userGet(id).then(res => ... )'
});

export const userAdminChange = (authUserId, userId, turnon) => dataLock((resolve, reject) => {
  // we assume only admins will have the option / ability to change admin status of users
  if (turnon === undefined) {
    reject(new InputError('turnon property is missing'));
    return;
  }
  const user = users[userId];
  if (turnon) {
    user.admin = true;
  } else {
    user.admin = false;
  }
  resolve();
});

export const userUpdate = (authUserId, email, password, name, image) => dataLock((resolve, reject) => {
  if (name) { users[authUserId].name = name; }
  if (password) { users[authUserId].password = password; }
  if (image) { users[authUserId].image = image; }
  if (email && getUserIdFromEmail(email) !== undefined) {
    throw new InputError(`Email address ${email} already taken`);
  } else if (email) { users[authUserId].email = email; }
  resolve();
});
