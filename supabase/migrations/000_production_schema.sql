


-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."get_popular_sets"("p_offset" integer DEFAULT 0, "p_limit" integer DEFAULT 50, "p_search" "text" DEFAULT NULL::"text", "p_theme_ids" integer[] DEFAULT NULL::integer[]) RETURNS TABLE("set_num" "text", "name" "text", "year" integer, "num_parts" integer, "img_url" "text", "theme_name" "text", "owner_count" bigint)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    ls.set_num,
    ls.name,
    ls.year,
    ls.num_parts,
    ls.img_url,
    t.name as theme_name,
    COUNT(DISTINCT us.user_id) as owner_count
  FROM lego_sets ls
  LEFT JOIN themes t ON ls.theme_id = t.id
  LEFT JOIN user_sets us ON ls.set_num = us.set_num
  WHERE
    -- Search filter with accent-insensitive matching
    (
      p_search IS NULL
      OR unaccent(lower(ls.name)) ILIKE '%' || unaccent(lower(p_search)) || '%'
      OR ls.set_num ILIKE '%' || p_search || '%'
      OR unaccent(lower(t.name)) ILIKE '%' || unaccent(lower(p_search)) || '%'
    )
    -- Theme filter (if provided)
    AND (
      p_theme_ids IS NULL
      OR ls.theme_id = ANY(p_theme_ids)
    )
  GROUP BY ls.set_num, ls.name, ls.year, ls.num_parts, ls.img_url, t.name
  ORDER BY owner_count DESC, ls.year DESC NULLS LAST
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;


ALTER FUNCTION "public"."get_popular_sets"("p_offset" integer, "p_limit" integer, "p_search" "text", "p_theme_ids" integer[]) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  insert into public.profiles (id, full_name, avatar_url, username)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'username'
  );
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."search_sets"("p_offset" integer DEFAULT 0, "p_limit" integer DEFAULT 50, "p_search" "text" DEFAULT NULL::"text", "p_theme_ids" integer[] DEFAULT NULL::integer[], "p_order_ascending" boolean DEFAULT false) RETURNS TABLE("set_num" "text", "name" "text", "year" integer, "num_parts" integer, "img_url" "text", "theme_name" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    ls.set_num,
    ls.name,
    ls.year,
    ls.num_parts,
    ls.img_url,
    t.name as theme_name
  FROM lego_sets ls
  LEFT JOIN themes t ON ls.theme_id = t.id
  WHERE
    -- Search filter with accent-insensitive matching
    (
      p_search IS NULL
      OR unaccent(lower(ls.name)) ILIKE '%' || unaccent(lower(p_search)) || '%'
      OR ls.set_num ILIKE '%' || p_search || '%'
      OR unaccent(lower(t.name)) ILIKE '%' || unaccent(lower(p_search)) || '%'
    )
    -- Theme filter (if provided)
    AND (
      p_theme_ids IS NULL
      OR ls.theme_id = ANY(p_theme_ids)
    )
  ORDER BY
    CASE WHEN p_order_ascending THEN ls.year END ASC NULLS FIRST,
    CASE WHEN NOT p_order_ascending THEN ls.year END DESC NULLS LAST,
    ls.set_num ASC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;


ALTER FUNCTION "public"."search_sets"("p_offset" integer, "p_limit" integer, "p_search" "text", "p_theme_ids" integer[], "p_order_ascending" boolean) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_prices_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_prices_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."follows" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "follower_id" "uuid" NOT NULL,
    "following_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "follows_no_self_follow" CHECK (("follower_id" <> "following_id"))
);


ALTER TABLE "public"."follows" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."lego_sets" (
    "set_num" "text" NOT NULL,
    "name" "text" NOT NULL,
    "year" integer,
    "theme_id" integer,
    "num_parts" integer,
    "img_url" "text"
);


ALTER TABLE "public"."lego_sets" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "updated_at" timestamp with time zone,
    "username" "text",
    "full_name" "text",
    "avatar_url" "text",
    "bio" "text",
    "location" "text",
    "date_of_birth" "date",
    "profile_visible" boolean DEFAULT true,
    "default_grid_view" boolean DEFAULT true,
    "email_notifications" boolean DEFAULT true,
    "brick_score" integer DEFAULT 0,
    "sets_count" integer DEFAULT 0,
    "pieces_count" integer DEFAULT 0
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."set_prices" (
    "set_num" "text" NOT NULL,
    "currency" character(3) NOT NULL,
    "retail_price" numeric(10,2) NOT NULL,
    "source" "text" DEFAULT 'brickset'::"text" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "set_prices_currency_check" CHECK (("currency" ~ '^[A-Z]{3}$'::"text"))
);


ALTER TABLE "public"."set_prices" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."themes" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL,
    "parent_id" integer
);


ALTER TABLE "public"."themes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_favorites" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "set_num" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_favorites" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_sets" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "set_num" "text" NOT NULL,
    "quantity" integer DEFAULT 1,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "collection_type" "text" DEFAULT 'collection'::"text" NOT NULL,
    CONSTRAINT "user_sets_collection_type_check" CHECK (("collection_type" = ANY (ARRAY['collection'::"text", 'wishlist'::"text"])))
);


ALTER TABLE "public"."user_sets" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_themes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "theme_id" integer NOT NULL,
    "display_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_themes" OWNER TO "postgres";


ALTER TABLE ONLY "public"."follows"
    ADD CONSTRAINT "follows_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."follows"
    ADD CONSTRAINT "follows_unique" UNIQUE ("follower_id", "following_id");



ALTER TABLE ONLY "public"."lego_sets"
    ADD CONSTRAINT "lego_sets_pkey" PRIMARY KEY ("set_num");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."set_prices"
    ADD CONSTRAINT "set_prices_pkey" PRIMARY KEY ("set_num", "currency", "source");



ALTER TABLE ONLY "public"."themes"
    ADD CONSTRAINT "themes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_favorites"
    ADD CONSTRAINT "user_favorites_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_favorites"
    ADD CONSTRAINT "user_favorites_user_set_unique" UNIQUE ("user_id", "set_num");



ALTER TABLE ONLY "public"."user_sets"
    ADD CONSTRAINT "user_sets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_sets"
    ADD CONSTRAINT "user_sets_user_id_set_num_key" UNIQUE ("user_id", "set_num");



ALTER TABLE ONLY "public"."user_themes"
    ADD CONSTRAINT "user_themes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_themes"
    ADD CONSTRAINT "user_themes_user_theme_unique" UNIQUE ("user_id", "theme_id");



CREATE INDEX "follows_follower_id_idx" ON "public"."follows" USING "btree" ("follower_id");



CREATE INDEX "follows_following_id_idx" ON "public"."follows" USING "btree" ("following_id");



CREATE INDEX "follows_relationship_idx" ON "public"."follows" USING "btree" ("follower_id", "following_id");



CREATE INDEX "idx_lego_sets_name_trgm" ON "public"."lego_sets" USING "gin" ("name" "public"."gin_trgm_ops");



CREATE INDEX "idx_lego_sets_set_num" ON "public"."lego_sets" USING "btree" ("set_num");



CREATE INDEX "idx_profiles_brick_score" ON "public"."profiles" USING "btree" ("brick_score" DESC);



CREATE INDEX "idx_set_prices_currency" ON "public"."set_prices" USING "btree" ("currency", "set_num");



CREATE INDEX "idx_user_sets_collection_type" ON "public"."user_sets" USING "btree" ("user_id", "collection_type");



CREATE INDEX "profiles_brick_score_idx" ON "public"."profiles" USING "btree" ("brick_score" DESC) WHERE ("brick_score" > 0);



CREATE UNIQUE INDEX "profiles_username_lower_idx" ON "public"."profiles" USING "btree" ("lower"("username")) WHERE ("username" IS NOT NULL);



CREATE INDEX "user_favorites_created_at_idx" ON "public"."user_favorites" USING "btree" ("created_at" DESC);



CREATE INDEX "user_favorites_user_id_idx" ON "public"."user_favorites" USING "btree" ("user_id");



CREATE INDEX "user_themes_user_id_idx" ON "public"."user_themes" USING "btree" ("user_id");



CREATE OR REPLACE TRIGGER "set_prices_updated_at_trigger" BEFORE UPDATE ON "public"."set_prices" FOR EACH ROW EXECUTE FUNCTION "public"."set_prices_updated_at"();



ALTER TABLE ONLY "public"."follows"
    ADD CONSTRAINT "follows_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."follows"
    ADD CONSTRAINT "follows_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."lego_sets"
    ADD CONSTRAINT "lego_sets_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "public"."themes"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."set_prices"
    ADD CONSTRAINT "set_prices_set_num_fkey" FOREIGN KEY ("set_num") REFERENCES "public"."lego_sets"("set_num") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."themes"
    ADD CONSTRAINT "themes_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."themes"("id");



ALTER TABLE ONLY "public"."user_favorites"
    ADD CONSTRAINT "user_favorites_set_num_fkey" FOREIGN KEY ("set_num") REFERENCES "public"."lego_sets"("set_num") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_favorites"
    ADD CONSTRAINT "user_favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_sets"
    ADD CONSTRAINT "user_sets_set_num_fkey" FOREIGN KEY ("set_num") REFERENCES "public"."lego_sets"("set_num") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_sets"
    ADD CONSTRAINT "user_sets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_themes"
    ADD CONSTRAINT "user_themes_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "public"."themes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_themes"
    ADD CONSTRAINT "user_themes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



CREATE POLICY "Allow public read access on themes" ON "public"."themes" FOR SELECT USING (true);



CREATE POLICY "Anyone can read prices" ON "public"."set_prices" FOR SELECT USING (true);



CREATE POLICY "Anyone can view follow relationships" ON "public"."follows" FOR SELECT USING (true);



CREATE POLICY "Lego sets are viewable by everyone." ON "public"."lego_sets" FOR SELECT USING (true);



CREATE POLICY "Public profiles are viewable by everyone." ON "public"."profiles" FOR SELECT USING (true);



CREATE POLICY "Service role can manage prices" ON "public"."set_prices" USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Users can add to their own collection." ON "public"."user_sets" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete from their own collection." ON "public"."user_sets" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete own favorites" ON "public"."user_favorites" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete own themes" ON "public"."user_themes" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can follow others" ON "public"."follows" FOR INSERT WITH CHECK (("auth"."uid"() = "follower_id"));



CREATE POLICY "Users can insert own favorites" ON "public"."user_favorites" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own profile" ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can insert own themes" ON "public"."user_themes" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can unfollow" ON "public"."follows" FOR DELETE USING (("auth"."uid"() = "follower_id"));



CREATE POLICY "Users can update own profile." ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can update own themes" ON "public"."user_themes" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own collection." ON "public"."user_sets" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own favorites" ON "public"."user_favorites" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own themes" ON "public"."user_themes" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own collection." ON "public"."user_sets" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."follows" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."lego_sets" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."set_prices" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."themes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_favorites" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_sets" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_themes" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."get_popular_sets"("p_offset" integer, "p_limit" integer, "p_search" "text", "p_theme_ids" integer[]) TO "anon";
GRANT ALL ON FUNCTION "public"."get_popular_sets"("p_offset" integer, "p_limit" integer, "p_search" "text", "p_theme_ids" integer[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_popular_sets"("p_offset" integer, "p_limit" integer, "p_search" "text", "p_theme_ids" integer[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."search_sets"("p_offset" integer, "p_limit" integer, "p_search" "text", "p_theme_ids" integer[], "p_order_ascending" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."search_sets"("p_offset" integer, "p_limit" integer, "p_search" "text", "p_theme_ids" integer[], "p_order_ascending" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_sets"("p_offset" integer, "p_limit" integer, "p_search" "text", "p_theme_ids" integer[], "p_order_ascending" boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."set_prices_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_prices_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_prices_updated_at"() TO "service_role";



GRANT ALL ON TABLE "public"."follows" TO "anon";
GRANT ALL ON TABLE "public"."follows" TO "authenticated";
GRANT ALL ON TABLE "public"."follows" TO "service_role";



GRANT ALL ON TABLE "public"."lego_sets" TO "anon";
GRANT ALL ON TABLE "public"."lego_sets" TO "authenticated";
GRANT ALL ON TABLE "public"."lego_sets" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."set_prices" TO "anon";
GRANT ALL ON TABLE "public"."set_prices" TO "authenticated";
GRANT ALL ON TABLE "public"."set_prices" TO "service_role";



GRANT ALL ON TABLE "public"."themes" TO "anon";
GRANT ALL ON TABLE "public"."themes" TO "authenticated";
GRANT ALL ON TABLE "public"."themes" TO "service_role";



GRANT ALL ON TABLE "public"."user_favorites" TO "anon";
GRANT ALL ON TABLE "public"."user_favorites" TO "authenticated";
GRANT ALL ON TABLE "public"."user_favorites" TO "service_role";



GRANT ALL ON TABLE "public"."user_sets" TO "anon";
GRANT ALL ON TABLE "public"."user_sets" TO "authenticated";
GRANT ALL ON TABLE "public"."user_sets" TO "service_role";



GRANT ALL ON TABLE "public"."user_themes" TO "anon";
GRANT ALL ON TABLE "public"."user_themes" TO "authenticated";
GRANT ALL ON TABLE "public"."user_themes" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";







