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
