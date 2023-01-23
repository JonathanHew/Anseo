CREATE DATABASE anseo_v2;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS signIns;
DROP TABLE IF EXISTS lists;
DROP TABLE IF EXISTS users;

-- users table 
CREATE TABLE users(
    user_id SERIAL PRIMARY KEY, 
    user_email VARCHAR(255) UNIQUE NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    created_at DATE DEFAULT current_date
);

--lists table
CREATE TABLE lists(
    list_id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    list_name VARCHAR(255) NOT NULL, 
    user_id INTEGER NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
            REFERENCES users(user_id)
                ON DELETE CASCADE
);

--signIns table
CREATE TABLE signIns(
    signIn_id SERIAL PRIMARY KEY,
    signIn_name VARCHAR(255) NOT NULL,
    signIn_number VARCHAR(255) NOT NULL,
    list_id uuid,
    CONSTRAINT fk_list
        FOREIGN KEY(list_id)
            REFERENCES lists(list_id)
                ON DELETE CASCADE
);



INSERT INTO users (user_email, user_password) VALUES ('jonathan@gmail.com', 'password');
INSERT INTO lists (list_name, user_id) VALUES ('jonathan-list1', 1);
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, list_id) VALUES (1, 'Jonathan', 'C19472842', '7dfc25b1-fe78-48dc-ad7a-1bacb2c8ba60');