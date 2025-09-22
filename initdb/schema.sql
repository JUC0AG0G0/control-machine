CREATE TABLE machines (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  ip VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'offline',
  last_seen TIMESTAMP
);

CREATE TABLE audio (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    path VARCHAR(255) UNIQUE NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    path VARCHAR(255) UNIQUE NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE javascript (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    path VARCHAR(255) UNIQUE NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);


INSERT INTO audio (name, path) VALUES
  ('hymne-france.mp3', 'files/audio/hymne-france.mp3'),
  ('hymne-usa.mp3', 'files/audio/hymne-usa.mp3'),
  ('je-pete-ma-biere.mp3', 'files/audio/je-pete-ma-biere.mp3'),
  ('je-suis-bien.mp3', 'files/audio/je-suis-bien.mp3'),
  ('Jeanne-au-secours-Jean-Marie-Le-Pen.mp3', 'files/audio/Jeanne-au-secours-Jean-Marie-Le-Pen.mp3'),
  ('karim-cuisiniere.mp3', 'files/audio/karim-cuisiniere.mp3');

INSERT INTO images (name, path) VALUES
  ('Akram.jpg', 'files/images/Akram.jpg'),
  ('Asim.jpg', 'files/images/Asim.jpg'),
  ('Florent-noel.png', 'files/images/Florent-noel.png'),
  ('Monkey-narotu.png', 'files/images/Monkey-narotu.png'),
  ('Ousama-sumo.png', 'files/images/Ousama-sumo.png'),
  ('Pierre-bourre.jpg', 'files/images/Pierre-bourre.jpg'),
  ('Pierre-foot.png', 'files/images/Pierre-foot.png'),
  ('Shrek.jpg', 'files/images/Shrek.jpg'),
  ('Smiley.png', 'files/images/Smiley.png');
