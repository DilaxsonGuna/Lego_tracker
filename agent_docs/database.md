# Database Schema (Supabase)

## Tables

| Table | PK | Description |
|-------|-----|-------------|
| `profiles` | id (uuid) | Extends auth.users: username, full_name, avatar_url, avatar_color, bio, updated_at |
| `lego_sets` | set_num (text) | Cached set data: name, year, theme_id, num_parts, img_url |
| `themes` | id (int) | Theme hierarchy: name, parent_id (self-referential) |
| `user_sets` | id | User collections: user_id, set_num, quantity, notes, collection_type, created_at |
| `user_favorites` | id | Favorite sets (max 4): user_id, set_num, created_at |
| `user_themes` | id | Theme preferences (max 10): user_id, theme_id, display_order, created_at |
| `follows` | id | Follow relationships: follower_id, following_id, created_at |

## Key Relationships

- `user_sets` → `profiles.id` + `lego_sets.set_num` (cascade delete)
- `user_favorites` → `profiles.id` + `lego_sets.set_num` (cascade delete)
- `user_themes` → `profiles.id` + `themes.id` (cascade delete)
- `follows` → `profiles.id` for both follower_id and following_id (cascade delete)
- `lego_sets.theme_id` → `themes.id`
- `themes.parent_id` → `themes.id` (self-referential)

## Unique Constraints

- `user_sets` — (user_id, set_num)
- `user_favorites` — (user_id, set_num)
- `user_themes` — (user_id, theme_id)
- `follows` — (follower_id, following_id)

## Row Level Security

| Table | Select | Insert | Update | Delete |
|-------|--------|--------|--------|--------|
| profiles | public | own | own | — |
| lego_sets | public | — | — | — |
| user_sets | own | own | own | own |
| user_favorites | own | own | own | own |
| user_themes | own | own | own | own |
| follows | all | own follower_id | — | own follower_id |

"own" = `auth.uid() = user_id` (or `follower_id` for follows)

## Migrations (`supabase/migrations/`)

1. `001_create_user_favorites.sql` — user_favorites table + RLS
2. `002_create_follows.sql` — follows table + RLS
3. `003_profiles_insert_policy.sql` — profiles insert policy
4. `004_add_profile_fields.sql` — avatar_color + bio columns
5. `005_create_user_themes.sql` — user_themes table + RLS
6. `get_popular_sets.sql` — PostgreSQL function for sorting by popularity (owner count)
