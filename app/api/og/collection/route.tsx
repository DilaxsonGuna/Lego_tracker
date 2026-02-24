import { ImageResponse } from "next/og";
import { createAnonClient } from "@/lib/supabase/server";
import {
  calculateBrickScore,
  getCurrentRank,
} from "@/lib/brick-score";

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return n.toString();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return new Response("Missing userId", { status: 400 });
  }

  try {
    const supabase = createAnonClient();

    // Fetch profile and collection stats in parallel
    const [profileResult, setsResult] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).single(),
      supabase
        .from("user_sets")
        .select(`quantity, lego_sets!inner(num_parts)`)
        .eq("user_id", userId)
        .eq("collection_type", "collection"),
    ]);

    if (profileResult.error || !profileResult.data) {
      return new Response("User not found", { status: 404 });
    }

    const profile = profileResult.data;
    const username = profile.username ?? "Collector";
    const fullName = profile.full_name ?? "";
    const avatarUrl = profile.avatar_url ?? "";
    const initials = username.charAt(0).toUpperCase();

    // Calculate stats
    let totalParts = 0;
    const setsCount = setsResult.data?.length ?? 0;

    for (const row of setsResult.data ?? []) {
      const set = row.lego_sets as unknown as { num_parts: number };
      totalParts += (set.num_parts ?? 0) * (row.quantity ?? 1);
    }

    const brickScore = calculateBrickScore(totalParts, setsCount);
    const rank = getCurrentRank(totalParts, setsCount);
    const rankName = rank ? rank.name : "New Collector";
    const rankIcon = rank ? rank.icon : "";

    return new ImageResponse(
      (
        <div
          style={{
            width: "1200",
            height: "630",
            display: "flex",
            flexDirection: "column",
            background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)",
            fontFamily: "sans-serif",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top accent bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "6",
              background: "linear-gradient(90deg, #ffd000, #ffaa00, #ffd000)",
              display: "flex",
            }}
          />

          {/* Stud pattern decorative elements */}
          <div
            style={{
              position: "absolute",
              top: "40",
              right: "40",
              width: "200",
              height: "200",
              borderRadius: "50%",
              background: "rgba(255, 208, 0, 0.05)",
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-60",
              left: "-60",
              width: "300",
              height: "300",
              borderRadius: "50%",
              background: "rgba(255, 208, 0, 0.03)",
              display: "flex",
            }}
          />

          {/* Main content */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              padding: "60px 70px",
              flex: 1,
              gap: "50",
            }}
          >
            {/* Left: Avatar */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16",
              }}
            >
              <div
                style={{
                  width: "180",
                  height: "180",
                  borderRadius: "50%",
                  border: "5px solid #ffd000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#333",
                  boxShadow: "0 0 40px rgba(255, 208, 0, 0.3)",
                  overflow: "hidden",
                }}
              >
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt=""
                    width={180}
                    height={180}
                    style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  />
                ) : (
                  <span
                    style={{
                      fontSize: "72",
                      fontWeight: "bold",
                      color: "#ffd000",
                    }}
                  >
                    {initials}
                  </span>
                )}
              </div>
            </div>

            {/* Right: Info */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                gap: "12",
              }}
            >
              {/* Username */}
              <div
                style={{
                  fontSize: "48",
                  fontWeight: "900",
                  color: "#ffffff",
                  letterSpacing: "-1px",
                }}
              >
                @{username}
              </div>

              {fullName && (
                <div
                  style={{
                    fontSize: "24",
                    color: "#999",
                    marginTop: "-4",
                  }}
                >
                  {fullName}
                </div>
              )}

              {/* Rank badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10",
                  marginTop: "8",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8",
                    background: "rgba(255, 208, 0, 0.15)",
                    border: "1px solid rgba(255, 208, 0, 0.3)",
                    borderRadius: "100",
                    padding: "8px 20px",
                  }}
                >
                  <span style={{ fontSize: "20" }}>{rankIcon}</span>
                  <span
                    style={{
                      fontSize: "18",
                      fontWeight: "800",
                      color: "#ffd000",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                    }}
                  >
                    {rankName}
                  </span>
                </div>
              </div>

              {/* Stats row */}
              <div
                style={{
                  display: "flex",
                  gap: "40",
                  marginTop: "24",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "4" }}>
                  <span
                    style={{
                      fontSize: "42",
                      fontWeight: "900",
                      color: "#ffd000",
                      lineHeight: "1",
                    }}
                  >
                    {formatCount(brickScore)}
                  </span>
                  <span
                    style={{
                      fontSize: "14",
                      fontWeight: "700",
                      color: "#888",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                    }}
                  >
                    Brick Score
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4" }}>
                  <span
                    style={{
                      fontSize: "42",
                      fontWeight: "900",
                      color: "#ffffff",
                      lineHeight: "1",
                    }}
                  >
                    {formatCount(setsCount)}
                  </span>
                  <span
                    style={{
                      fontSize: "14",
                      fontWeight: "700",
                      color: "#888",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                    }}
                  >
                    Sets
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4" }}>
                  <span
                    style={{
                      fontSize: "42",
                      fontWeight: "900",
                      color: "#ffffff",
                      lineHeight: "1",
                    }}
                  >
                    {formatCount(totalParts)}
                  </span>
                  <span
                    style={{
                      fontSize: "14",
                      fontWeight: "700",
                      color: "#888",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                    }}
                  >
                    Pieces
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom branding bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 70px",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12" }}>
              <div
                style={{
                  width: "32",
                  height: "32",
                  borderRadius: "6",
                  background: "#ffd000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18",
                  fontWeight: "900",
                  color: "#1a1a1a",
                }}
              >
                B
              </div>
              <span
                style={{
                  fontSize: "22",
                  fontWeight: "800",
                  color: "#ffd000",
                }}
              >
                BrickBox
              </span>
            </div>
            <span
              style={{
                fontSize: "16",
                color: "#666",
              }}
            >
              Track your LEGO collection
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch {
    return new Response("Failed to generate image", { status: 500 });
  }
}
