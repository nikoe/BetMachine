CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users
(
  user_id uuid NOT NULL DEFAULT uuid_generate_v4(),
  firstname text,
  surname text,
  birthday date,
  address text,
  postalcode text,
  city text,
  country text,
  username text NOT NULL,
  password text NOT NULL,
  CONSTRAINT users_pkey PRIMARY KEY (user_id)
  UNIQUE (username);
);