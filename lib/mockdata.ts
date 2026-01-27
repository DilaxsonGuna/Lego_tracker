import { UserProfile, UserStats } from "@/types/profile";
import { LegoSet } from "@/types/lego-set";
import { NavItem } from "@/types/navigation";

export const mockUser: UserProfile = {
  id: "1",
  username: "Legoman",
  fullName: "Lego Man",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB_HlMUYDl-51eWMKQkskGzfD6jJxnT8GY5JeLPGQWZqF2Q-FvLxm5y_N-yUYFHv6kG0GXfQAH_Xsgd0DBjWnFVRtieadMrBzW2wLCja9FJNGx5bEb-IRHSvOz_w0FKy54bFKsh4OteUQ_QuFYrzIP6erA46V4ZAlQS-dcR_o7nP3Mz_JjUXJaJQOFZyA6bJs4MwemhsTs7g1VydCR7-DS2stDt5_gHzgE4r8u_M5pMdOQqvSgKTCEg50MDf7ohQcFZSYJ5YR6XJbbQ",
  bio: "Technic specialist based in Copenhagen. Obsessed with 1:8 supercars and modular buildings.",
  isVerified: true,
  role: "Master Builder",
  isOnline: true,
};

export const mockUserStats: UserStats = {
  setsCount: 412,
  piecesCount: 845200,
  rank: "Master Builder",
  rankNumber: 42,
};

export const mockNavItems: NavItem[] = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Explore", href: "/explore", icon: "compass" },
  { label: "My Shelf/Vault", href: "/shelf", icon: "book-open" },
  { label: "Profile", href: "/profile", icon: "user", isActive: true },
];

export const mockLegoSets: LegoSet[] = [
  {
    setNum: "75192",
    name: "Millennium Falcon\u2122",
    year: 2017,
    themeId: 158,
    numParts: 7541,
    setImgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBhY4K7Go2_YNkFAbzGsmBx0UKkEk5drzm7g3qTJ41obkUUG31u3HYhxUk-xUdbLb5TRI_KkkTiOWKDjP1lNw3eOJgzX4BoUPgs4ohwiZ1Coc-kLj5QP_zdu-DAvNNFCpsqiA9tJxGHaDbHYfuK5B5FNLlcHlXIoX0yC6jcX0e7lDgHBOjWXiHo1FtAaElHav8Ow31dmx9noZyJ4fVUjZIi7rxEzrxrnn1-4wAy1EC7HY3pn7rd6OTYPdEV2i9nY2TIAMDp2Ax9gptj",
    price: "$849.99",
  },
  {
    setNum: "10307",
    name: "Eiffel Tower",
    year: 2022,
    themeId: 130,
    numParts: 10001,
    setImgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDUi1_YZk4xU9oI1i7UrFQ2ShOJOjgNNl59J9CmIYCBv93Qso-yDa1gZvKfbw93iQTk62F5MvU4aQB31tTadq6a5uNAijy--j6MXaBG-t3gt4jLuVBALJhd4NVbXDzzBufGB-y1F6vkqvxw5PNj1qRLB-UBxXi-FsWp6VPhUyVYw9KcXNcHNpUEYMJ6J4bBsm7ejgH6dxdOSTUZvN7ACJY7ieLE-DD36x5Wsx6r_xUkPpjJV1qf5ivgDwdRUUtHLwvJbv3iyZZOEdVW",
    price: "$629.99",
  },
  {
    setNum: "10294",
    name: "Titanic",
    year: 2021,
    themeId: 561,
    numParts: 9090,
    setImgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDTOm544GICKazkLOR4XwI1icdRyi4I0Rcjo57hPrIJpNc5_ipj9YBlHokrqmXyf6o0wWniIF-anVVm4JShweHHjw4ji8zGD6oSOhzIVPprrnCGpYFOV9yLul5yPHIvmfDK0nEFOSQTAwazDflSn2YedmAhULmCUgEF6foTHt8mZctpXEB_4ygu4pqyXdYkXBlCjtXGJDbOddLv8hs_jMLk-LxTBCHapqGEffkye1VOPkvdK70902DYSI8W37vqnP5WCCfR6xptTaK3",
    price: "$679.99",
  },
  {
    setNum: "10305",
    name: "Lion Knights\u2019 Castle",
    year: 2022,
    themeId: 186,
    numParts: 4514,
    setImgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC3080c2qWrJU1aq1uM7SkxA9SySQ0QL6Gu6_vZfbwuj3fylCP9JaDmn-R_ox0NuqAEEcLvRoy7qYxjZzI4DzmPHNEVCXvtLcMxfNIoqnyY0U4ts-cSUR3MZudcMUs3Vt3LqURj2H3OyzxN8acmRAQgYnNCJ2AJpkBTiKT3PlcpnxMqLw8SkoF3bwEcuAmFp2jTOxcg593aplxgIMUFpw7uiupQrnM2uCl8pJMmWoNFqLYZ7tksN1GHklS1iZRS68ByNaGxPvQImaXF",
    price: "$399.99",
  },
  {
    setNum: "10316",
    name: "Rivendell\u2122",
    year: 2023,
    themeId: 561,
    numParts: 6167,
    setImgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAEeNMakIHacoTSayt_KjS7NXqIn0wRP01evPksT2PKPbGsJYtTUHhYrAuZLI-f_zZhLaf9QQvT5eKr-AV49QUE8Nawts6W-yT7e8VNKb45lrvUwb_lGYE_cXVes0bCFuywLdU0hTLPBMFGRviUeury9jG3rOEt82Ff0Rth-1rTup1BFFM-nS00CACTbwum5YqhWoLCZr6bYr3dOkzLdtDQ0xsahc0YLQ0hpt8glhcH33CpAN8GsCMTQ7feshUoE-k8KoQ1mBUhGJPa",
    price: "$499.99",
  },
  {
    setNum: "42143",
    name: "Ferrari Daytona SP3",
    year: 2022,
    themeId: 610,
    numParts: 3778,
    setImgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDWpFZMnfMnwuUpyUeUnCbNcr1POWJJZos8zTabTNgq-KNEGwiW3AiDnz-LGXBR0Yev7r1u6ue5s8XRzyZY25AuJPsImRcCY5-XW8EvB0fLduQsT8vlUxRtC4s2WGbnyi-86dfzdUfCozvGjWxVIJN0nBObi-BMZHwOfq3Q6NdNsYMR6rMKjR1xqsXS3CzMeCe9fNLF9l-9baapVc3a_FbjPMn7nCP0UjV4GywgoNGNK57MT0o3-eg8EzjOsGajx9D96eAEsTHMFozb",
    price: "$449.99",
  },
];
