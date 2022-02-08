CREATE DATABASE kasacko

CREATE TABLE "session" (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(20),
    password VARCHAR(128),
    private_profile Boolean DEFAULT false,
    deleted Boolean DEFAULT false
);

CREATE TABLE followers ( 
    id SERIAL PRIMARY KEY,
    follower_user_id BIGINT NOT NULL REFERENCES users(id),
    follows_user_id BIGINT NOT NULL REFERENCES users(id)
);

CREATE TABLE followers_requests ( 
    id SERIAL PRIMARY KEY,
    follower_user_id BIGINT NOT NULL REFERENCES users(id),
    follows_user_id BIGINT NOT NULL REFERENCES users(id)
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    post_title VARCHAR(80),
    post_content VARCHAR(500),
    votes INT DEFAULT 0,
    post_created_at DATE DEFAULT NOW(),
    post_updated_at DATE DEFAULT NOW(),
    num_of_comments INT DEFAULT 0,
    deleted Boolean DEFAULT false
);

CREATE TABLE votedposts (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    post_id BIGINT NOT NULL REFERENCES posts(id),
    liked Boolean NOT NULL
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    post_id BIGINT REFERENCES posts(id),
    reply_id BIGINT REFERENCES comments(id),
    reply_post_id INT,
    comment_content VARCHAR(500),
    votes INT DEFAULT 0,
    comment_created_at DATE DEFAULT NOW(),
    comment_updated_at DATE DEFAULT NOW(),
    num_of_replies INT DEFAULT 0,
    deleted Boolean DEFAULT false
);

CREATE TABLE votedcomments (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    comment_id BIGINT NOT NULL REFERENCES comments(id),
    liked Boolean NOT NULL
);

CREATE TABLE userprofiles (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    username VARCHAR,
    picture VARCHAR DEFAULT 'hello',
    sex VARCHAR DEFAULT 'hello',
    bio VARCHAR DEFAULT 'hello',
    age INT DEFAULT 0
);

CREATE TABLE chats (
    id SERIAL PRIMARY KEY,
    sendername VARCHAR(200),
    username VARCHAR(200),
    msg VARCHAR(200),
    chat_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE votedposts;
DROP TABLE votedcomments;
DROP TABLE comments;
DROP TABLE posts;
DROP TABLE followers;
DROP TABLE followers_requests;
DROP TABLE userprofiles;
DROP TABLE chats;
DROP TABLE users;
