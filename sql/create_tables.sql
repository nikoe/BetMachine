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
  role text NOT NULL default 'USER',
  CONSTRAINT users_pkey PRIMARY KEY (user_id)
);

CREATE TABLE transactions
(
transaction_id uuid NOT NULL DEFAULT uuid_generate_v4(),
user_id uuid NOT NULL,
transaction_time timestamp NOT NULL DEFAULT now(),
amount decimal NOT NULL DEFAULT 0.00,
transaction_type text NOT NULL,
CONSTRAINT transactions_pkey PRIMARY KEY (transaction_id),
CONSTRAINT transactions_user_fkey FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE matches
(
match_id uuid NOT NULL DEFAULT uuid_generate_v4(),
creator_id uuid NOT NULL,
start_time timestamp NOT NULL,
end_time timestamp,
close_time timestamp NOT NULL,
name text NOT NULL,
description text,
status text NOT NULL DEFAULt 'NOT_STARTED',
CONSTRAINT matches_pkey PRIMARY KEY (match_id),
CONSTRAINT matches_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES users (user_id)
);

CREATE TABLE odds
(
odd_id uuid NOT NULL DEFAULT uuid_generate_v4(),
match_id uuid NOT NULL,
name text NOT NULL,
probability decimal NOT NULL DEFAULT 0.00,
factor decimal NOT NULL DEFAULT 0.00,
CONSTRAINT odds_pkey PRIMARY KEY (odd_id),
CONSTRAINT odds_match_id_fkey FOREIGN KEY (match_id) REFERENCES matches (match_id) ON DELETE CASCADE
);