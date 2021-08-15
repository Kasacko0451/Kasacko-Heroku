CREATE DATABASE kasacko

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
    post_votes INT DEFAULT 0,
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
    comment_votes INT DEFAULT 0,
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
    user_id BIGINT NOT NULL REFERENCES users(id),
    chatthread_id BIGINT NOT NULL,
    msg VARCHAR(200),
    is_read Boolean DEFAULT false,
    chat_date DATE DEFAULT NOW(),
    deleted Boolean DEFAULT false
);

DROP TABLE votedposts;
DROP TABLE votedcomments;
DROP TABLE comments;
DROP TABLE posts;
DROP TABLE followers;
DROP TABLE users;
