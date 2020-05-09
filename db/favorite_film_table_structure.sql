CREATE TABLE favorite_film (
`user_id` INT NOT NULL,
`film_id` VARCHAR(20) NOT NULL,
PRIMARY KEY(`user_id`, `film_id`)
);