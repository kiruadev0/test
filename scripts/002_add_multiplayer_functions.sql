-- Add function to increment games won
CREATE OR REPLACE FUNCTION increment_games_won(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET games_won = games_won + 1,
      games_played = games_played + 1
  WHERE id = user_id;
END;
$$;

-- Add function to increment games played
CREATE OR REPLACE FUNCTION increment_games_played(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET games_played = games_played + 1
  WHERE id = user_id;
END;
$$;
