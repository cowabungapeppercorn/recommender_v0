CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  is_admin BOOLEAN DEFAULT false NOT NULL
);

CREATE TABLE recommendations (
  id SERIAL PRIMARY KEY,
  user_to INTEGER NOT NULL REFERENCES users
    ON DELETE CASCADE,
  user_from INTEGER NOT NULL REFERENCES users
    ON DELETE CASCADE,
  content TEXT NOT NULL,
  seen BOOLEAN DEFAULT false
);