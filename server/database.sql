CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DROP FUNCTION IF EXISTS RANDOM_STRING CASCADE;
DROP FUNCTION IF EXISTS UNIQUE_RANDOM CASCADE;

DROP TABLE IF EXISTS signIns CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS locations CASCADE;

create function RANDOM_STRING(len int) returns text as $$
declare
  chars text[] = '{0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,
  a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z}';
  result text = '';
  i int = 0;
  rand bytea;
begin
  -- generate secure random bytes and convert them to a string of chars.
  rand = gen_random_bytes($1);
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

--table to store information for campuses
CREATE TABLE locations (
    location_id SERIAL PRIMARY KEY,
    location_name VARCHAR(255) NOT NULL,
    location_polygon GEOMETRY NOT NULL
);

INSERT INTO locations (location_id, location_name, location_polygon) VALUES (
  1, 
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

INSERT INTO locations (location_id, location_name, location_polygon) VALUES (
  2,
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

-- Insert Default User
INSERT INTO users (user_id, user_email, user_password ) VALUES (1, 'jonathan@gmail.com', '$2a$10$FWlOvUdHgYIEQkWpYF2.Xu5pk4p9CUoZ0u8oKWnFTU8lDP1K9ZQfm');

-- Insert Modules for Default User 
INSERT INTO modules (module_name, user_id, module_id) VALUES ('Final Year Project', 1, 1);
INSERT INTO modules (module_name, user_id, module_id) VALUES ('Advanced Security', 1, 2);
INSERT INTO modules (module_name, user_id, module_id) VALUES ('Enterprise Application Development', 1, 3);
INSERT INTO modules (module_name, user_id, module_id) VALUES ('Geographical Information Systems', 1, 4);
INSERT INTO modules (module_name, user_id, module_id) VALUES ('Systems Software', 1, 5);

-- Insert Sessions for Default Module 
INSERT INTO sessions (session_name, user_id, module_id, session_date, session_time, session_id) VALUES ('Monday 3rd April', 1, 1, '2023-04-03', '13:00:00', '01ec36bc-b0fe-4e9c-882e-1517bf5cc0ac');
INSERT INTO sessions (session_name, user_id, module_id, session_date, session_time, session_id) VALUES ('Tuesday 4th April', 1, 1, '2023-04-04', '14:00:00', 'db8edbc9-7064-42d1-928e-2736cd555d19');
INSERT INTO sessions (session_name, user_id, module_id, session_date, session_time, session_id) VALUES ('Wednesday 5th April', 1, 1, '2023-04-05', '15:00:00', '151566a0-8457-4c1d-bda5-e82a02d66357');
INSERT INTO sessions (session_name, user_id, module_id, session_date, session_time, session_id) VALUES ('Thursday 6th April', 1, 1, '2023-04-06', '12:00:00', '52e2cf1b-1d75-402f-8167-fc5c8c49aa75');
INSERT INTO sessions (session_name, user_id, module_id, session_date, session_time, session_id) VALUES ('Friday 7th April', 1, 1, '2023-04-07', '09:00:00', '6b370fdd-fc63-4346-8e53-03d838b41a63');
INSERT INTO sessions (session_name, user_id, module_id, session_date, session_time, session_id) VALUES ('Monday 10th April', 1, 1, '2023-04-10', '13:00:00', 'c41c8ebf-c963-43f6-8ba2-52280e64a5ad');
INSERT INTO sessions (session_name, user_id, module_id, session_date, session_time, session_id) VALUES ('Tuesday 11th April', 1, 1, '2023-04-11', '14:00:00', 'ee5eaa45-701b-4fef-823d-11d033562239');
INSERT INTO sessions (session_name, user_id, module_id, session_date, session_time, session_id) VALUES ('Wednesday 12th April', 1, 1, '2023-04-12', '15:00:00', '30ee5587-3cd7-479a-8342-d3e43dafb349');
INSERT INTO sessions (session_name, user_id, module_id, session_date, session_time, session_id) VALUES ('Thursday 13th April', 1, 1, '2023-04-13', '12:00:00', 'ef1592d2-32b1-416f-a80f-b993fcef8295');
INSERT INTO sessions (session_name, user_id, module_id, session_date, session_time, session_id) VALUES ('Friday 14th April', 1, 1, '2023-04-14', '09:00:00', '5c386ba7-f68f-463a-b459-9d724807779b');
INSERT INTO sessions (session_name, user_id, module_id, session_date, session_time, session_id) VALUES ('Monday 17th April', 1, 1, '2023-04-17', '13:00:00', '2deda158-ed65-4686-bbd8-2b1a53ce774d');
INSERT INTO sessions (session_name, user_id, module_id, session_date, session_time, session_id) VALUES ('Tuesday 18th April', 1, 1, '2023-04-18', '14:00:00', 'c159b3d9-2967-44bb-9af4-97b4752606cd');
INSERT INTO sessions (session_name, user_id, module_id, session_date, session_time, session_id) VALUES ('Wednesday 19th April', 1, 1, '2023-04-19', '15:00:00', 'e1db8993-4e2f-4fb2-b1f2-3a1ad4b51785');
INSERT INTO sessions (session_name, user_id, module_id, session_date, session_time, session_id, session_is_active) VALUES ('Thursday 20th April', 1, 1, '2023-04-20', '12:00:00', '011493b1-eac0-4ad6-94a0-c401df00b46a', true);

-- Insert Sessions for other modules for C1942842
INSERT INTO sessions (session_name, user_id, module_id, session_date, session_time, session_id) VALUES ('Monday 3rd April', 1, 2, '2023-04-03', '17:00:00', 'c470d27a-33e5-4b47-b403-a9c6881e54e9');
INSERT INTO sessions (session_name, user_id, module_id, session_date, session_time, session_id) VALUES ('Tuesday 4th April', 1, 3, '2023-04-04', '18:00:00', '767edcd8-e4bf-4257-9f0b-6858caa279ad');
INSERT INTO sessions (session_name, user_id, module_id, session_date, session_time, session_id) VALUES ('Wednesday 5th April', 1, 4, '2023-04-05', '16:00:00', '7d9a7478-66c0-4f2b-88cf-20fbd89a5c61');
INSERT INTO sessions (session_name, user_id, module_id, session_date, session_time, session_id) VALUES ('Thursday 6th April', 1, 5, '2023-04-06', '19:00:00', '58dd1e16-19d6-49fe-8d24-011251f5a4c1');
-- C19472842 Sign into sessions for other modules 
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (1, 'Jonathan', 'C19472842', true, '2023-04-03', '17:00:00', 'c470d27a-33e5-4b47-b403-a9c6881e54e9');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (2, 'Jonathan', 'C19472842', true, '2023-04-04', '18:00:00', '767edcd8-e4bf-4257-9f0b-6858caa279ad');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (3, 'Jonathan', 'C19472842', true, '2023-04-05', '16:00:00', '7d9a7478-66c0-4f2b-88cf-20fbd89a5c61');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (4, 'Jonathan', 'C19472842', true, '2023-04-06', '19:00:00', '58dd1e16-19d6-49fe-8d24-011251f5a4c1');

-- Session 1 Sign Ins
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (5, 'Jonathan', 'C19472842', true, '2023-04-03', '13:00:00', '01ec36bc-b0fe-4e9c-882e-1517bf5cc0ac');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (6, 'Tammy', 'C19000001', true, '2023-04-03', '13:01:00', '01ec36bc-b0fe-4e9c-882e-1517bf5cc0ac');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (7, 'Amber', 'C19000002', true, '2023-04-03', '13:02:00', '01ec36bc-b0fe-4e9c-882e-1517bf5cc0ac');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (8, 'Hashim', 'C19000003', true, '2023-04-03', '13:03:00', '01ec36bc-b0fe-4e9c-882e-1517bf5cc0ac');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (9, 'Osman', 'C19000004', true, '2023-04-03', '13:04:00', '01ec36bc-b0fe-4e9c-882e-1517bf5cc0ac');
-- Session 2 Sign Ins
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (10, 'Tammy', 'C19000001', true, '2023-04-04', '14:01:00', 'db8edbc9-7064-42d1-928e-2736cd555d19');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (11, 'Amber', 'C19000002', true, '2023-04-04', '14:02:00', 'db8edbc9-7064-42d1-928e-2736cd555d19');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (12, 'Hashim', 'C19000003', true, '2023-04-04', '14:03:00', 'db8edbc9-7064-42d1-928e-2736cd555d19');
-- Session 3 Sign Ins
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (13, 'Tammy', 'C19000001', true, '2023-04-05', '15:01:00', '151566a0-8457-4c1d-bda5-e82a02d66357');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (14, 'Amber', 'C19000002', true, '2023-04-05', '15:02:00', '151566a0-8457-4c1d-bda5-e82a02d66357');
--Session 4 Sign Ins
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (15, 'Jonathan', 'C19472842', true, '2023-04-06', '12:00:00', '52e2cf1b-1d75-402f-8167-fc5c8c49aa75');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (16, 'Tammy', 'C19000001', true, '2023-04-06', '12:01:00', '52e2cf1b-1d75-402f-8167-fc5c8c49aa75');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (17, 'Amber', 'C19000002', true, '2023-04-06', '12:02:00', '52e2cf1b-1d75-402f-8167-fc5c8c49aa75');
-- Session 5 Sign Ins
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (18, 'Jonathan', 'C19472842', true, '2023-04-07', '09:00:00', '6b370fdd-fc63-4346-8e53-03d838b41a63');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (19, 'Tammy', 'C19000001', true, '2023-04-07', '09:01:00', '6b370fdd-fc63-4346-8e53-03d838b41a63');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (20, 'Amber', 'C19000002', true, '2023-04-07', '09:02:00', '6b370fdd-fc63-4346-8e53-03d838b41a63');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (21, 'Hashim', 'C19000003', true, '2023-04-07', '09:03:00', '6b370fdd-fc63-4346-8e53-03d838b41a63');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (22, 'Osman', 'C19000004', true, '2023-04-07', '09:04:00', '6b370fdd-fc63-4346-8e53-03d838b41a63');
-- Session 6 Sign Ins
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (23, 'Jonathan', 'C19472842', true, '2023-04-10', '13:00:00', 'c41c8ebf-c963-43f6-8ba2-52280e64a5ad');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (24, 'Tammy', 'C19000001', true, '2023-04-10', '13:01:00', 'c41c8ebf-c963-43f6-8ba2-52280e64a5ad');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (25, 'Amber', 'C19000002', true, '2023-04-10', '13:02:00', 'c41c8ebf-c963-43f6-8ba2-52280e64a5ad');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (26, 'Hashim', 'C19000003', true, '2023-04-10', '13:03:00', 'c41c8ebf-c963-43f6-8ba2-52280e64a5ad');
-- Session 7 Sign Ins
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (27, 'Jonathan', 'C19472842', true, '2023-04-11', '14:00:00', 'ee5eaa45-701b-4fef-823d-11d033562239');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (28, 'Tammy', 'C19000001', true, '2023-04-11', '14:01:00', 'ee5eaa45-701b-4fef-823d-11d033562239');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (29, 'Amber', 'C19000002', true, '2023-04-11', '14:02:00', 'ee5eaa45-701b-4fef-823d-11d033562239');
-- Session 8 Sign Ins
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (30, 'Jonathan', 'C19472842', true, '2023-04-12', '15:00:00', '30ee5587-3cd7-479a-8342-d3e43dafb349');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (31, 'Tammy', 'C19000001', true, '2023-04-12', '15:01:00', '30ee5587-3cd7-479a-8342-d3e43dafb349');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (32, 'Amber', 'C19000002', true, '2023-04-12', '15:02:00', '30ee5587-3cd7-479a-8342-d3e43dafb349');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (33, 'Hashim', 'C19000003', true, '2023-04-12', '15:03:00', '30ee5587-3cd7-479a-8342-d3e43dafb349');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (34, 'Osman', 'C19000004', true, '2023-04-12', '15:04:00', '30ee5587-3cd7-479a-8342-d3e43dafb349');
-- Session 9 Sign Ins 
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (35, 'Jonathan', 'C19472842', true, '2023-04-13', '12:00:00', 'ef1592d2-32b1-416f-a80f-b993fcef8295');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (36, 'Tammy', 'C19000001', true, '2023-04-13', '12:01:00', 'ef1592d2-32b1-416f-a80f-b993fcef8295');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (37, 'Amber', 'C19000002', true, '2023-04-13', '12:02:00', 'ef1592d2-32b1-416f-a80f-b993fcef8295');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (38, 'Hashim', 'C19000003', true, '2023-04-13', '12:03:00', 'ef1592d2-32b1-416f-a80f-b993fcef8295');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (39, 'Osman', 'C19000004', true, '2023-04-13', '12:04:00', 'ef1592d2-32b1-416f-a80f-b993fcef8295');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (40, 'Barbra', 'C19000005', true, '2023-04-13', '12:05:00', 'ef1592d2-32b1-416f-a80f-b993fcef8295');
-- Session 10 Sign Ins
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (41, 'Jonathan', 'C19472842', true, '2023-04-14', '09:00:00', '5c386ba7-f68f-463a-b459-9d724807779b');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (42, 'Tammy', 'C19000001', true, '2023-04-14', '09:01:00', '5c386ba7-f68f-463a-b459-9d724807779b');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (43, 'Amber', 'C19000002', true, '2023-04-14', '09:02:00', '5c386ba7-f68f-463a-b459-9d724807779b');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (44, 'Hashim', 'C19000003', true, '2023-04-14', '09:03:00', '5c386ba7-f68f-463a-b459-9d724807779b');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (45, 'Osman', 'C19000004', true, '2023-04-14', '09:04:00', '5c386ba7-f68f-463a-b459-9d724807779b');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (46, 'Barbra', 'C19000005', true, '2023-04-14', '09:05:00', '5c386ba7-f68f-463a-b459-9d724807779b');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (47, 'Isobella', 'C19000006', true, '2023-04-14', '09:06:00', '5c386ba7-f68f-463a-b459-9d724807779b');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (48, 'Ilya', 'C19000007', true, '2023-04-14', '09:07:00', '5c386ba7-f68f-463a-b459-9d724807779b');
-- Session 11 Sign Ins
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (49, 'Tammy', 'C19000001', true, '2023-04-17', '13:01:00', '2deda158-ed65-4686-bbd8-2b1a53ce774d');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (50, 'Amber', 'C19000002', true, '2023-04-17', '13:02:00', '2deda158-ed65-4686-bbd8-2b1a53ce774d');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (51, 'Hashim', 'C19000003', true, '2023-04-17', '13:03:00', '2deda158-ed65-4686-bbd8-2b1a53ce774d');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (52, 'Osman', 'C19000004', true, '2023-04-17', '13:04:00', '2deda158-ed65-4686-bbd8-2b1a53ce774d');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (53, 'Barbra', 'C19000005', true, '2023-04-17', '13:05:00', '2deda158-ed65-4686-bbd8-2b1a53ce774d');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (54, 'Isobella', 'C19000006', true, '2023-04-17', '13:06:00', '2deda158-ed65-4686-bbd8-2b1a53ce774d');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (55, 'Ilya', 'C19000007', true, '2023-04-17', '13:07:00', '2deda158-ed65-4686-bbd8-2b1a53ce774d');
-- Session 12 Sign Ins
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (56, 'Tammy', 'C19000001', true, '2023-04-18', '14:01:00', 'c159b3d9-2967-44bb-9af4-97b4752606cd');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (57, 'Amber', 'C19000002', true, '2023-04-18', '14:02:00', 'c159b3d9-2967-44bb-9af4-97b4752606cd');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (58, 'Hashim', 'C19000003', true, '2023-04-18', '14:03:00', 'c159b3d9-2967-44bb-9af4-97b4752606cd');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (59, 'Osman', 'C19000004', true, '2023-04-18', '14:04:00', 'c159b3d9-2967-44bb-9af4-97b4752606cd');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (60, 'Barbra', 'C19000005', true, '2023-04-18', '14:05:00', 'c159b3d9-2967-44bb-9af4-97b4752606cd');
-- Session 13 Sign Ins
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (61, 'Jonathan', 'C19472842', false, '2023-04-19', '15:00:00', 'e1db8993-4e2f-4fb2-b1f2-3a1ad4b51785');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (62, 'Tammy', 'C19000001', true, '2023-04-19', '15:01:00', 'e1db8993-4e2f-4fb2-b1f2-3a1ad4b51785');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (63, 'Amber', 'C19000002', true, '2023-04-19', '15:02:00', 'e1db8993-4e2f-4fb2-b1f2-3a1ad4b51785');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (64, 'Hashim', 'C19000003', true, '2023-04-19', '15:03:00', 'e1db8993-4e2f-4fb2-b1f2-3a1ad4b51785');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (65, 'Osman', 'C19000004', true, '2023-04-19', '15:04:00', 'e1db8993-4e2f-4fb2-b1f2-3a1ad4b51785');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (66, 'Barbra', 'C19000005', true, '2023-04-19', '15:05:00', 'e1db8993-4e2f-4fb2-b1f2-3a1ad4b51785');
-- Session 14 
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (67, 'Jonathan', 'C19472842', true, '2023-04-20', '12:00:00', '011493b1-eac0-4ad6-94a0-c401df00b46a');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (68, 'Tammy', 'C19000001', false, '2023-04-20', '12:01:00', '011493b1-eac0-4ad6-94a0-c401df00b46a');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (69, 'Amber', 'C19000002', true, '2023-04-20', '12:02:00', '011493b1-eac0-4ad6-94a0-c401df00b46a');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (70, 'Hashim', 'C19000003', true, '2023-04-20', '12:03:00', '011493b1-eac0-4ad6-94a0-c401df00b46a');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (71, 'Osman', 'C19000004', true, '2023-04-20', '12:04:00', '011493b1-eac0-4ad6-94a0-c401df00b46a');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (72, 'Barbra', 'C19000005', true, '2023-04-20', '12:05:00', '011493b1-eac0-4ad6-94a0-c401df00b46a');
INSERT INTO signIns (signIn_id, signIn_name, signIn_number, signIn_on_campus, signin_date, signin_time, session_id) VALUES (73, 'Isobella', 'C19000006', true, '2023-04-20', '12:06:00', '011493b1-eac0-4ad6-94a0-c401df00b46a');
