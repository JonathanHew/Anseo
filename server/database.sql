CREATE DATABASE anseo_v2;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP FUNCTION IF EXISTS GEN_RANDOM_BYTES;
DROP FUNCTION IF EXISTS RANDOM_STRING;
DROP FUNCTION IF EXISTS UNIQUE_RANDOM;

DROP TABLE IF EXISTS signIns;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;

create function GEN_RANDOM_BYTES(int) returns bytea as
'$libdir/pgcrypto', 'pg_random_bytes' language c strict;

create function RANDOM_STRING(len int) returns text as $$
declare
  chars text[] = '{0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z}';
  result text = '';
  i int = 0;
  rand bytea;
begin
  -- generate secure random bytes and convert them to a string of chars.
  rand = GEN_RANDOM_BYTES($1);
  for i in 0..len-1 loop
    -- rand indexing is zero-based, chars is 1-based.
    result = result || chars[1 + (get_byte(rand, i) % array_length(chars, 1))];
  end loop;
  return result;
end;
$$ language plpgsql;

-- return random string confirmed to not exist in given tablename.colname
create function UNIQUE_RANDOM(len int, _table text, _col text) returns text as $$
declare
  result text;
  numrows int;
begin
  result = random_string(len);
  loop
    execute format('select 1 from %I where %I = %L', _table, _col, result);
    get diagnostics numrows = row_count;
    if numrows = 0 then
      return result; 
    end if;
    result = RANDOM_STRING(len);
  end loop;
end;
$$ language plpgsql;

-- users table 
CREATE TABLE users(
    user_id SERIAL PRIMARY KEY, 
    user_email VARCHAR(255) UNIQUE NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    created_at DATE DEFAULT current_date
);

--sessions table
CREATE TABLE sessions(
    session_id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_name VARCHAR(255) NOT NULL, 
    session_date DATE DEFAULT current_date,
    session_time TIME DEFAULT localtime(0),
    session_is_active BOOLEAN DEFAULT false,
    user_id INTEGER NOT NULL,
    session_pin VARCHAR(6) DEFAULT UNIQUE_RANDOM(6, 'sessions', 'session_pin'),
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
            REFERENCES users(user_id)
                ON DELETE CASCADE
);

--signIns table
CREATE TABLE signIns(
    signIn_id SERIAL PRIMARY KEY,
    signIn_name VARCHAR(255) NOT NULL,
    signIn_number VARCHAR(255) NOT NULL,
    signIn_date DATE DEFAULT current_date,
    signIn_time TIME DEFAULT localtime(0),
    session_id uuid,
    CONSTRAINT fk_session
        FOREIGN KEY(session_id)
            REFERENCES sessions(session_id)
                ON DELETE CASCADE
);

INSERT INTO users (user_email, user_password) VALUES ('jonathan@gmail.com', 'password');
INSERT INTO sessions (session_name, session_is_active, user_id) VALUES ('Dev Test2', 'f', 1);
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, session_id) VALUES (1, 'Jonathan', 'C19472842', '7dfc25b1-fe78-48dc-ad7a-1bacb2c8ba60');

