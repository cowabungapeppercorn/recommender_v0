CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false NOT NULL
);

CREATE TABLE recommendations (
  id SERIAL PRIMARY KEY,
  user_to INTEGER NOT NULL REFERENCES users,
  user_from INTEGER NOT NULL REFERENCES users,
  content TEXT NOT NULL
);

CREATE TABLE follows (
  id SERIAL PRIMARY KEY,
  user_being_followed INTEGER NOT NULL REFERENCES users,
  user_following INTEGER NOT NULL REFERENCES users
);