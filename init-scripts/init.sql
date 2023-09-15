CREATE TYPE Gender AS ENUM ('male', 'female');

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR NOT NULL,
    lastname VARCHAR,
    email VARCHAR UNIQUE,
    password VARCHAR,
    age INT,
    gender Gender NOT NULL
);

CREATE TABLE IF NOT EXISTS likes (
    id SERIAL PRIMARY KEY,
    liker_id INT NOT NULL,
    liked_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (liker_id) REFERENCES users(id),
    FOREIGN KEY (liked_id) REFERENCES users(id)
);

INSERT INTO users (firstname, age, gender) VALUES
    ('chaf', 25, 'male'),
    ('Sawako', 30, 'female'),
    ('Rico', 28, 'male'),
    ('Yurisa', 22, 'female');

-- Insert initial likes into the likes table
INSERT INTO likes (liker_id, liked_id) VALUES
    (1, 2),
    (1, 3),
    (3, 4),
    (4, 3);