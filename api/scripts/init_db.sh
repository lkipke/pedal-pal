echo "** Creating default DB and users"

mysql -u root -p$MYSQL_ROOT_PASSWORD --execute \
"USE $MYSQL_DATABASE;

CREATE TABLE user
(
    id INTEGER AUTO_INCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO user
VALUES (
    NULL,
    '$OWNER_FIRST_NAME',
    '$OWNER_LAST_NAME',
    '$OWNER_USERNAME',
    '$OWNER_PASSWORD'
);

CREATE TABLE session
(
    id INTEGER AUTO_INCREMENT,
    name TEXT,
    user_id INTEGER NOT NULL,
    last_modified TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id),
    PRIMARY KEY (id)
);

CREATE TABLE exercise_data
(
    id INTEGER AUTO_INCREMENT,
    session_id INTEGER NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    heart_rate INTEGER,
    kmph DOUBLE,
    rpm INTEGER,
    watts INTEGER,
    calories INTEGER,
    FOREIGN KEY (session_id) REFERENCES session(id),
    PRIMARY KEY (id)
);"

echo "** Finished creating default DB and users"