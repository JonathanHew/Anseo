-- users table 
CREATE TABLE users(
    user_id SERIAL PRIMARY KEY, 
    user_email VARCHAR(255) UNIQUE NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    created_at DATE DEFAULT current_date
);

--lists table
CREATE TABLE lists(
    list_id SERIAL PRIMARY KEY,
    list_name VARCHAR(255) NOT NULL
);

--signIns table
CREATE TABLE signIns(
    signIn_id SERIAL PRIMARY KEY,
    signIn_name VARCHAR(255) NOT NULL,
    signIn_number VARCHAR(255) NOT NULL,
    list_id INTEGER,
    CONSTRAINT fk_list
        FOREIGN KEY(list_id)
            REFERENCES lists(list_id)
                ON DELETE CASCADE
);




INSERT INTO lists (list_id, list_name) VALUES (1, "list1");
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, list_id) VALUES (1, 'Jonathan', 'C19472842', 1);