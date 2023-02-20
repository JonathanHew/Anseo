CREATE DATABASE anseo_v2;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";


DROP FUNCTION IF EXISTS GEN_RANDOM_BYTES;
DROP FUNCTION IF EXISTS RANDOM_STRING;
DROP FUNCTION IF EXISTS UNIQUE_RANDOM;

DROP TABLE IF EXISTS signIns;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS modules;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS locations;

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

--modules table 
CREATE TABLE modules (
  module_id SERIAL PRIMARY KEY,
  module_name VARCHAR(255) NOT NULL,
  user_id INTEGER NOT NULL, 
  CONSTRAINT fk_user
        FOREIGN KEY(user_id)
            REFERENCES users(user_id)
                ON DELETE CASCADE
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
    module_id INTEGER NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_module
        FOREIGN KEY(module_id)
        REFERENCES modules(module_id)
        ON DELETE CASCADE
);

--signIns table
CREATE TABLE signIns(
    signIn_id SERIAL PRIMARY KEY,
    signIn_name VARCHAR(255) NOT NULL,
    signIn_number VARCHAR(255) NOT NULL,
    signIn_date DATE DEFAULT current_date,
    signIn_time TIME DEFAULT localtime(0),
    signIn_on_campus BOOLEAN NOT NULL,
    session_id uuid,
    CONSTRAINT fk_session
        FOREIGN KEY(session_id)
            REFERENCES sessions(session_id)
                ON DELETE CASCADE
);

--table to store coordinates for campuses
CREATE TABLE locations (
    location_id SERIAL PRIMARY KEY,
    location_name VARCHAR(255) NOT NULL,
    location_polygon GEOMETRY NOT NULL
);

INSERT INTO users (user_email, user_password) VALUES ('jonathan@gmail.com', 'password');
INSERT INTO modules (module_name, user_id) VALUES ('1st Year Maths', 1);
INSERT INTO sessions (session_name, user_id, module_id) VALUES ('Monday Morning 20/02/23', 1, 1);
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, session_id) VALUES (1, 'Jonathan', 'C19472842', false,'44c7162d-baef-48fc-9602-3a7443a8eba8');
INSERT INTO locations (location_name, location_polygon) VALUES (
  'library',
  ST_SetSRID(
    'POLYGON((
      -6.2879568 53.3578114,
      -6.2878656 53.3576481,
      -6.2874391 53.3577362,
      -6.2874016 53.3576866,
      -6.2872782 53.3577106,
      -6.2873077 53.3577554,
      -6.2868759 53.3578498,
      -6.2869671 53.3580083,
      -6.2872675 53.3579571,
      -6.2874150 53.3582004,
      -6.2876349 53.3581524,
      -6.2875008 53.3579107,
      -6.2879568 53.3578114
    ))' :: GEOMETRY, 4326
  )
);

INSERT INTO locations (location_name, location_polygon) VALUES (
  'TU Dublin Central Quad',
  ST_SetSRID(
    'POLYGON((
      -6.2824093 53.3567958,
      -6.2823074 53.3560258,
      -6.2821116 53.3560018,
      -6.2819935 53.3563492,
      -6.2812506 53.3562724,
      -6.2812533 53.3562403,
      -6.2813230 53.3562451,
      -6.2814196 53.3559282,
      -6.2818112 53.3559586,
      -6.2818326 53.3558289,
      -6.2811434 53.3556895,
      -6.2809986 53.3562098,
      -6.2811381 53.3562290,
      -6.2811327 53.3562626,
      -6.2809879 53.3562514,
      -6.2809581 53.3563794,
      -6.2811297 53.3564018,
      -6.2810600 53.3566452,
      -6.2824093 53.3567958
    ))' :: GEOMETRY, 4326
  )
);

SELECT ST_Intersects(
  (SELECT location_polygon FROM locations WHERE location_id = 1),
  ST_SetSRID (ST_Point(-6.2817008, 53.356427):: GEOMETRY, 4326));