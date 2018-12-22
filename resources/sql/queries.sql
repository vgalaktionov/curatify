-- :name upsert-user! :! :n
-- :doc creates a new user record
INSERT INTO users
(id, email, display_name, token)
VALUES (:id, :email, :display_name, :token)
ON CONFLICT (id) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    email = EXCLUDED.email,
    token = EXCLUDED.token;
