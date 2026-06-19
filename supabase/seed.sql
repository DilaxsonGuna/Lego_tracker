-- ============================================================================
-- Local dev seed (auto-loaded by `supabase db reset`).
-- Identity fixtures only: auth users + profiles. NO catalog dependency.
--
-- The large LEGO catalog (themes/sets/prices) and per-user collection data
-- live in supabase/seeds/ and are loaded separately by scripts/seed-local-data.sh
-- (run automatically via `npm run db:reset`). Source: prod, 2026-06-19.
-- Users dilax2001@gmail.com / nicef98651@gopicta.com — password: Password123! (dev only)
-- ============================================================================

--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: -
--

INSERT INTO auth.users VALUES ('00000000-0000-0000-0000-000000000000', 'acdf335c-f899-4e43-ae9d-39044b373ab0', 'authenticated', 'authenticated', 'nicef98651@gopicta.com', '$2a$06$Hun7ZZae3VqiF0W6XHNISOPXAMJcWFLm6ggwmluwsgheZpFVZVz3W', '2026-06-19 20:28:34.907571+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-06-19 20:29:17.450643+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2026-06-19 20:28:34.907571+00', '2026-06-19 20:29:17.451303+00', NULL, NULL, '', '', NULL, DEFAULT, '', 0, NULL, '', NULL, false, NULL, false);
INSERT INTO auth.users VALUES ('00000000-0000-0000-0000-000000000000', 'aca98c2a-0201-4f69-ab05-1bd0c220d7ee', 'authenticated', 'authenticated', 'dilax2001@gmail.com', '$2a$06$qJ3s6lSHEjjek.BmQ35Jtevs5SWSqWsHOgjuPBcUdjq2.fNEdlCay', '2026-06-19 20:28:34.907571+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-06-19 20:35:16.296627+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2026-06-19 20:28:34.907571+00', '2026-06-19 20:35:16.299217+00', NULL, NULL, '', '', NULL, DEFAULT, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: -
--

INSERT INTO auth.identities VALUES ('aca98c2a-0201-4f69-ab05-1bd0c220d7ee', 'aca98c2a-0201-4f69-ab05-1bd0c220d7ee', '{"sub": "aca98c2a-0201-4f69-ab05-1bd0c220d7ee", "email": "dilax2001@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2026-06-19 20:28:34.907571+00', '2026-06-19 20:28:34.907571+00', '2026-06-19 20:28:34.907571+00', DEFAULT, '4b393df5-9b8a-438b-a62f-6db7612bf10e');
INSERT INTO auth.identities VALUES ('acdf335c-f899-4e43-ae9d-39044b373ab0', 'acdf335c-f899-4e43-ae9d-39044b373ab0', '{"sub": "acdf335c-f899-4e43-ae9d-39044b373ab0", "email": "nicef98651@gopicta.com", "email_verified": true, "phone_verified": false}', 'email', '2026-06-19 20:28:34.907571+00', '2026-06-19 20:28:34.907571+00', '2026-06-19 20:28:34.907571+00', DEFAULT, '2e1d1687-416f-46be-b751-13d9cad90fd5');


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.profiles VALUES ('aca98c2a-0201-4f69-ab05-1bd0c220d7ee', '2026-02-20 21:28:45.769+00', 'dixi', 'Pokèmon master', '#22c55e', 'I love pokèmon legosss', 'Italy', '2001-11-07', true, true, true, 0, 0, 0, 0, 0);
INSERT INTO public.profiles VALUES ('acdf335c-f899-4e43-ae9d-39044b373ab0', '2026-02-06 18:09:26.624+00', 'admin', 'Admin', 'green', 'I like Lego so much', 'Italy', NULL, true, true, true, 6095, 13, 4795, 0, 0);


--
-- PostgreSQL database dump complete
--


