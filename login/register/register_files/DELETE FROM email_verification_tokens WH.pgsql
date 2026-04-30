DELETE FROM email_verification_tokens WHERE user_id = (SELECT id FROM users WHERE email = 'stargazeclothing2@gmail.com');
DELETE FROM users WHERE email = 'stargazeclothing2@gmail.com';