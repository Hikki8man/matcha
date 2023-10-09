CREATE TYPE Gender AS ENUM ('male', 'female');
CREATE TYPE CompletedSteps AS ENUM ('name', 'gender', 'photo', 'bio', 'completed');

CREATE TABLE IF NOT EXISTS user_account (
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE,
    password VARCHAR,
    token_validation VARCHAR,
    verified BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS profile (
    user_id INT PRIMARY KEY,
    name VARCHAR NOT NULL,
    birth_date DATE,
    gender Gender NOT NULL,
    completed_steps CompletedSteps,
    FOREIGN KEY (user_id) REFERENCES user_account (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS photo (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    filename VARCHAR,
    path VARCHAR,
    size BIGINT,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES user_account (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS likes (
    id SERIAL PRIMARY KEY,
    liker_id INT NOT NULL,
    liked_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (liker_id) REFERENCES user_account (id),
    FOREIGN KEY (liked_id) REFERENCES user_account (id)
);

INSERT INTO user_account (email, password)
VALUES ('chaf@example.com', 'hashed_password_for_chaf'),
       ('sawako@example.com', 'hashed_password_for_sawako'),
       ('rico@example.com', 'hashed_password_for_rico'),
       ('yurisa@example.com', 'hashed_password_for_yurisa');

INSERT INTO profile (user_id, name, birth_date, gender)
VALUES (1, 'Chaf', '1998-09-15', 'male'),
       (2, 'Sawako', '1993-08-20', 'female'),
       (3, 'Rico', '1995-11-12', 'male'),
       (4, 'Yurisa', '2001-04-03', 'female');

INSERT INTO likes (liker_id, liked_id)
VALUES (1, 2),
       (1, 3),
       (3, 4),
       (4, 3);
