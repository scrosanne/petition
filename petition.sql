CREATE TABLE signatures (
    id SERIAL primary key,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255),
    signature VARCHAR
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_profiles(
  	id SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users(id),
	age VARCHAR(255),
	city VARCHAR(255),
	url VARCHAR(255)
);

ALTER TABLE signatures ADD COLUMN user_id INTEGER;

ALTER TABLE signatures DROP COLUMN firstname;
ALTER TABLE signatures DROP COLUMN lastname;

SELECT users.firstname, users.lastname, user_profiles.city,  user_profiles.url
FROM users
JOIN user_profiles
ON users.id = user_profiles.user_id;


ALTER TABLE user_profiles ADD CONSTRAINT user_id UNIQUE (user_id);
