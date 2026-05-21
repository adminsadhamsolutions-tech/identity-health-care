CREATE DATABASE IF NOT EXISTS identity_health_care CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE identity_health_care;

CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  email VARCHAR(150) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  service VARCHAR(120) NOT NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS blogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  content LONGTEXT NOT NULL,
  media_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  rating TINYINT NOT NULL DEFAULT 5
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  media_url TEXT NOT NULL,
  type ENUM('image','video') NOT NULL DEFAULT 'image'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO admin_users (username, password) VALUES
('admin', '$2y$10$Woo1ckeugB9AsIk/Ssx25ORoR1BevKIozG5ZURl6q0NDekLAt99Hu');

INSERT INTO blogs (title, description, content, media_url) VALUES
('Recover with gentle physiotherapy', 'A compassionate physiotherapy plan for postpartum strength and mobility.', 'Our physiotherapy sessions are personalized with medical oversight. Each exercise is selected to support pelvic health, posture, and functional movement.', 'https://images.unsplash.com/photo-1556228724-4f4236744a93?auto=format&fit=crop&w=1200&q=80'),
('Nutrition habits for women', 'Nutrition that supports hormonal health, energy, and sustainable weight loss.', 'This blog covers simple meal strategies, hydration reminders, and balanced plate ideas to support busy women every day.', 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80'),
('Antenatal fitness essentials', 'Move safely during pregnancy with core stability and lower back support.', 'Learn which exercises help reduce pain, prepare your body for labor, and keep your baby active and supported.', 'https://images.unsplash.com/photo-1516397286047-34d8f1dc5a51?auto=format&fit=crop&w=1200&q=80');

INSERT INTO testimonials (name, message, rating) VALUES
('Priya R.', 'The team helped me recover after my birth with warmth and professional guidance. I feel stronger every week.', 5),
('Sana K.', 'Wonderful care and a beautiful environment. The fitness classes feel safe and effective.', 5),
('Meera L.', 'I love the personalized coaching and the focus on women’s wellbeing.', 4);

INSERT INTO gallery (media_url, type) VALUES
('https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=900&q=80', 'image'),
('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80', 'image'),
('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=80', 'image');
