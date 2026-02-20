import { UserProfile, UserStats, FavoriteSet, Milestone } from "@/types/profile";
import { LegoSet } from "@/types/lego-set";
import { FeedPost, Story, TrendingSet, SuggestedUser } from "@/types/feed";
import { ThemeCategory, DiscoverySet } from "@/types/explore";
import { VaultSet, VaultStats } from "@/types/vault";
import { RANK_TIERS, calculateBrickScore, calculateRankProgress } from "@/lib/brick-score";

export const mockUser: UserProfile = {
  id: "1",
  username: "Legoman",
  fullName: "Lego Man",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB_HlMUYDl-51eWMKQkskGzfD6jJxnT8GY5JeLPGQWZqF2Q-FvLxm5y_N-yUYFHv6kG0GXfQAH_Xsgd0DBjWnFVRtieadMrBzW2wLCja9FJNGx5bEb-IRHSvOz_w0FKy54bFKsh4OteUQ_QuFYrzIP6erA46V4ZAlQS-dcR_o7nP3Mz_JjUXJaJQOFZyA6bJs4MwemhsTs7g1VydCR7-DS2stDt5_gHzgE4r8u_M5pMdOQqvSgKTCEg50MDf7ohQcFZSYJ5YR6XJbbQ",
  bio: "Engineering at heart, plastic in hand. Specialized in high-complexity Technic models and hyper-detailed Modular City expansion. Founding member of the Nordic Brick Council.",
  isVerified: true,
  role: "Master Builder",
  isOnline: true,
  followers: 12400,
  following: 842,
  friends: 156,
  interests: ["Technic", "StarWars", "ModularCity", "AFOL"],
};

export const mockUserStats: UserStats = {
  setsCount: 412,
  piecesCount: 845210,
  brickScore: calculateBrickScore(845210, 412),
  rank: RANK_TIERS[0], // Living Legend (meets 500k+ pieces, 500+ sets)
  rankProgress: calculateRankProgress(845210, 412),
  rankNumber: 42,
  vaultValue: "$42,910",
};

export const mockFavoriteSets: FavoriteSet[] = [
  {
    setNum: "75192",
    name: "Millennium Falcon",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBhY4K7Go2_YNkFAbzGsmBx0UKkEk5drzm7g3qTJ41obkUUG31u3HYhxUk-xUdbLb5TRI_KkkTiOWKDjP1lNw3eOJgzX4BoUPgs4ohwiZ1Coc-kLj5QP_zdu-DAvNNFCpsqiA9tJxGHaDbHYfuK5B5FNLlcHlXIoX0yC6jcX0e7lDgHBOjWXiHo1FtAaElHav8Ow31dmx9noZyJ4fVUjZIi7rxEzrxrnn1-4wAy1EC7HY3pn7rd6OTYPdEV2i9nY2TIAMDp2Ax9gptj",
  },
  {
    setNum: "10307",
    name: "Eiffel Tower",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDUi1_YZk4xU9oI1i7UrFQ2ShOJOjgNNl59J9CmIYCBv93Qso-yDa1gZvKfbw93iQTk62F5MvU4aQB31tTadq6a5uNAijy--j6MXaBG-t3gt4jLuVBALJhd4NVbXDzzBufGB-y1F6vkqvxw5PNj1qRLB-UBxXi-FsWp6VPhUyVYw9KcXNcHNpUEYMJ6J4bBsm7ejgH6dxdOSTUZvN7ACJY7ieLE-DD36x5Wsx6r_xUkPpjJV1qf5ivgDwdRUUtHLwvJbv3iyZZOEdVW",
  },
  {
    setNum: "10294",
    name: "Titanic",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDTOm544GICKazkLOR4XwI1icdRyi4I0Rcjo57hPrIJpNc5_ipj9YBlHokrqmXyf6o0wWniIF-anVVm4JShweHHjw4ji8zGD6oSOhzIVPprrnCGpYFOV9yLul5yPHIvmfDK0nEFOSQTAwazDflSn2YedmAhULmCUgEF6foTHt8mZctpXEB_4ygu4pqyXdYkXBlCjtXGJDbOddLv8hs_jMLk-LxTBCHapqGEffkye1VOPkvdK70902DYSI8W37vqnP5WCCfR6xptTaK3",
  },
  {
    setNum: "10316",
    name: "Rivendell",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAEeNMakIHacoTSayt_KjS7NXqIn0wRP01evPksT2PKPbGsJYtTUHhYrAuZLI-f_zZhLaf9QQvT5eKr-AV49QUE8Nawts6W-yT7e8VNKb45lrvUwb_lGYE_cXVes0bCFuywLdU0hTLPBMFGRviUeury9jG3rOEt82Ff0Rth-1rTup1BFFM-nS00CACTbwum5YqhWoLCZr6bYr3dOkzLdtDQ0xsahc0YLQ0hpt8glhcH33CpAN8GsCMTQ7feshUoE-k8KoQ1mBUhGJPa",
  },
];

export const mockMilestones: Milestone[] = [
  { id: "m1", icon: "diamond", label: "100k Bricks" },
  { id: "m2", icon: "history_edu", label: "10 Years" },
  { id: "m3", icon: "architecture", label: "Designer" },
  { id: "m4", icon: "social_leaderboard", label: "Top 100" },
  { id: "m5", icon: "verified_user", label: "Verified" },
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

export const mockStories: Story[] = [
  {
    id: "add",
    username: "Add Build",
    avatarUrl: "",
    isAddStory: true,
    hasUnviewed: false,
  },
  {
    id: "s1",
    username: "New Drops",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAost-OlDgh1c2DaU5CSvznYnsX4rYv0mChzHwNJAKz4vIZw9P3LVNVKG1zPDgmlZA393taGlKuyr03ltvPBIU9RiXUYSjyGiHtOzbJJQVy2fNToQpSAQoLMAXKfWUkQW69LRNljMBCsifuHX6GUo9bofQ0jgDW-MvNqHZdQL8dOOWoer64vofUPOExv1U4NxvefalWV4BPjKmn8U-oDuCTHtq3w5l-ZFhqlgYIRBXzOqDDMmVPlriueLCnB-MbGVe0CgIkA3MY-KNQ",
    isAddStory: false,
    hasUnviewed: true,
  },
  {
    id: "s2",
    username: "BrickFan",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAQBE-Oc762FXVe869Psu32S33jumjoyaCVaYALQaLzDPL0Z_jR0gY9F4tYWCfvuKf3SSOkyt08QADCs7SBC2XRsjPjd9qcXCNrNfuFKCa97ewv6ObupUo0W0iKfRiZl4veXM_Z8x9tfxQN6mxprL52leFCP6-A8WrHrQ3egnun04x6WaJgOa2klabP6A9Y7xh5TxvTqpCAFmxmw3O2tDEaPVL3bJxbh7MMkr2yezv8dtbQvCGQBBndgnkjck4wFIhy9bGcs65hdUd8",
    isAddStory: false,
    hasUnviewed: true,
  },
  {
    id: "s3",
    username: "SpaceLab",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAFM82YNRdcunI66EOMkGPtLKBU9Zm7MT-mLSuLH1TTvDaMSWAc6d5qwPoWhKGGnFuEq3PdaFL4eMWWqFYblJ2BRZ-1zfZgWL7vL_PqKvsqsniinjN5Pur3eQ2hJ0LsvuSnQ_aaMyCsySSqtHSBFQ_U9TLy4O4YlGJmflFvfMROWFC8B5Y_1b2aNAgOa5I3ZQSEkk1qd-0UpOEAFJ7qA_97c7654B2Y-x9kiW919dEMkg13gi5Bql774ygZ2woBatRn91OVYdfD6Etl",
    isAddStory: false,
    hasUnviewed: false,
  },
  {
    id: "s4",
    username: "ColorPop",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBFt_32gqnvA6y7zmzJwkI_YBr_gd1799Eub_-buc6rVpNozXDNGduO-Ul0yHuRJxPtNUH4oi7l66SAMP9YWP5RZKQcmTwnVs5N91v7NlCgSbfMedk7x2chc_wVwARVMh-oeOrnJLZy7A9BXKbJS6DDk28XAmC18w5JyIDbXgX7iXeKfs7sdKvL3plJnhoyelo_0b6AZT_QFmhDRKli1zq9_w90kCo1ygj-vlROXrrB3dMApPuM4emH8E-fWw_bWt9ALisUmBxzcOVL",
    isAddStory: false,
    hasUnviewed: false,
  },
];

export const mockFeedPosts: FeedPost[] = [
  {
    id: "p1",
    user: {
      username: "BrickMaster99",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAqDcHwLbr5TVkILNLk_77OlVCJ6RsiDqJb6RHhGXouptMSQJkJQ3wxSx3SP2CTzXEf3N8HWuUUrBBnn74NOBXgB4p7gmR7y-EyM-9wSCdXRvv_1MVTmpZD-xqddKfJwhlYNAGzhIptwJV_vgU8IuzVr5EkjSA6ap1SKsKxuk_gqoSgHJ6i5HRypgj7q5U6PzyVQ_N_RxhYfuD4YRe_UfCMYnY_pjz4nW8ICyQvS9_fGWlW5MWxTsNadhV18vuL7rKRyp5vGoCHYFde",
    },
    type: "build",
    actionText: "just added 'The Titanic (10294)' to their vault!",
    timeAgo: "2h ago",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDtsTVZq_DlQYz8Kvm89xs1sZADtT2ybJoQxN7zoblJaabGJOhh4La4m_1dCVZZXKeI1fiOMYXFNY5fqHfB50ImdzNzp470J9NXwjnhb-Dk6-p-iFaGgjFDoHZ7Ut1O1X9YJr7IB_v2xYAN46IvAQQl_2HgozTQAb6LIZUrvQfouOh6KmJKrugvUiZCX9Djlvz8UdKhrylDkVTTBHng0Z3X2l-00kadhb59u9zV62FXCBhvQhaNXCWO1cIubxUhYcS9iaXJ9SZKKeY1",
    aspectRatio: "4/3",
    legoSet: { setNum: "10294", name: "The Titanic" },
    likes: 1200,
    comments: 84,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "p2",
    user: {
      username: "StudsAndSnot",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCNK0QAeKRuSl4CYI6Wh0873LugCd9dueZiVWbHRmOtn1WOunb_mYlJV_Nk94Y7C-wD-GLR2AEEuizbDB5Iyg13jvAJFyf_Dc3lL--H7bFffa-IjFgZHx5pRkTs-3-_xc0tC-TGBqae6rko8Q8q57LgNNeh57JCqHgQou7eGYrJz9c3U-9PC36oY3cweg91i6F4mnvmTArdz8vKXVKZxffizK5Nzdb_U7oCzYarKJNm6IkhLZhBdObLQ8BN31e3tny4XejYxVPamB8v",
    },
    type: "review",
    actionText: "posted a review for 'Rivendell'",
    timeAgo: "5h ago",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA5AMf57R0ZJbfB-U5rT7Hwstvt9AhJHccA8HhK9Yl6NlThLX0roNdV05EIzcEk0qvk4nvIvNfNQ1WvzeaMC28j4bwYxuiWKD44kv1citexj13Ydf-6rrPFnwlfhZneVxVL2_24Rvxp3kSfzKA4AILwN2zyrnfC8KdNWdyxlp4yYbIKwuunVlPJJkAKPw_vXEYBwK96F-sWFSKPakbTyr6pzlsu33Fste8xXWhQ5HhdPYH2iIXK7QVl8k9tU516HtQnfzSLW6X9J38P",
    aspectRatio: "16/9",
    rating: 9.8,
    legoSet: { setNum: "10316", name: "Rivendell" },
    likes: 856,
    comments: 124,
    isLiked: false,
    isBookmarked: false,
    topComment: {
      username: "LegoLover88",
      text: "The details on the roof are insane! Best set of 2023.",
    },
  },
];

export const mockTrendingSets: TrendingSet[] = [
  {
    setNum: "75192",
    name: "Millennium Falcon",
    thumbnailUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA93drom2YWBHUOiNMmk61tcOto10zNG6edu7UC4O6OQIsFDMYybG9CjMP_Ecm8KvkNWHLT17E3RbiKjuSzHLxvnkYm2ExSZDS7YE1hYlw7XUtamtMK-K6EHMOC8vet_tKv82sfkjy37luCIo6PdAzeuirhhpSxZCSWuxP-t-D5_Oxel8gzgmTnoN8RXjecKnk2yverpYDDBru6W3Q-NlJqTikthz5gV4DfNqAx2549OxO7c0s0HDY8XdkqvOWtkbYi8OnMc2J3rs08",
    postCount: "4.2k posts",
  },
  {
    setNum: "10307",
    name: "Eiffel Tower",
    thumbnailUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuADQnJUuuXqydMpwcOEHbO1X9jI-iSffkpqa0DXwTEPu_CWVVVBtHJPRQqVj57XAsLCkvh8nijTvNbWqRfP_COlvXp-v5yLtO842LpboKi-ibrukLnmZt65KKdmO2uPrtRKo3tED3K28EYw1HmxcfTqU-XWnaJuYeVLP04-bVuwUlsuJQOxDZCg7cvxD57ENqgPA8jUl-Uxhtl6Uh2RwO25aV5CzFRpyexhg_-kgOV3JekkauszEt4jY0QPolIuMBKfS-ZTTC65X01S",
    postCount: "3.8k posts",
  },
  {
    setNum: "10318",
    name: "Concorde",
    thumbnailUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD6l6mW5HLduevIGGQK7H5HWySVx5Lv6TlB37pkRss_6OcJva-fWBlLhTpmdKRyS-KxWizUv4MIJ8yZn5dKehYVXk2_086vw6H4sZFGbISkEhcAa8el9JbC4qO12752QNTi3417GPz1JJ-6CgwWoonB7NOdLvhEkHo-QvDuoY9v0cNmCD2J2fRld4wgvg2B1AbzcN0t51bXCDHoTZi_nWf2-fL-Vip0wRt6hcaZpP6dfIvyLX7vzJ2YXiLkGRw3GwBJlC4dBAbdyCUU",
    postCount: "1.5k posts",
  },
];

export const mockSuggestedUsers: SuggestedUser[] = [
  {
    id: "su1",
    username: "BlockHead_22",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAz7bSHuz0lx7ZrhusgSjTzVEsmBg2eAJelo-LegAb8KPZd-L9VHyHuzXe9u4mYwCbD-nojhCvrh6xZ9KmpCBg2OPu8Jjk_ZIXAVohO0NjYvKk_vm86QLDIyK1ivjnwEMHf6roYPBKxVXWtQS57xvOX945j-aMFkEYQQvaZvmKyxv_4VTLi9gzTB1ZK8Xd2Pat-pPOmH41WgRInqvxKDRk79XZs-WN-TwN8ynDZAwcZKOx0o2jxLtsW2sAjulFYSG4_qu5Y5S4qh7Uu",
  },
  {
    id: "su2",
    username: "SarahBricks",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCpxjEc18rwBXghWHykR9ruWO9z9QaAeeyU6mxaDGP5XxuuiTU1UKNu1AD-mX2RfbwLiXP0ZcLbh5qRD8m8lANDk7bS9_3s7ORGIbCJSq82_pbpAR9xvnTDzUEaO5-Cc4LZnJxNyZidHmgI7i_sCD5uFYGPCNc3l2YM2L7zgC2BjMjcIbLIP-JneXGnrVOEuaJZwrZlBsiARwdRAgLmb6ane7E0BaX2VnWdj5dCZd3pARIHqG04n8tWNDyFPkn0KXeWBwjesbGsUrPa",
  },
];

export const mockThemeCategories: ThemeCategory[] = [
  { id: "all", label: "All" },
  { id: 158, label: "Star Wars" },
  { id: 1, label: "Technic" },
  { id: 621, label: "Icons" },
  { id: 577, label: "Ideas" },
  { id: 252, label: "Architecture" },
  { id: 696, label: "Marvel" },
  { id: 246, label: "Harry Potter" },
];

export const mockDiscoverySets: DiscoverySet[] = [
  {
    setNum: "10316",
    name: "Rivendell\u2122",
    numParts: 6167,
    year: 2023,
    theme: "icons",
    setImgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDkpWRFPwRquey0azRxVhPnYjj4VQGqDuT85ITixw_AkpnrrzUgnv4k_bre9HOc3G3lvOGMkhHyJtQvQa2wL3Yo8voeMh2nNzpVBPs8Wwc2TysZSqsQh-tUnW1cT7ZnAs7uZ7uuSX37Mrc_qXRWpTMQehJtnloTGtWw9_cpeutSjJPDi2YGspRx52sxno_s0HdvMm4rkqJfoKq2--7z7Y0-p728W6tQPJE5d_GfHd6wMCRmloj6Xm-_eMj8ABpq9Fe7j5OVOCobk6uw",
  },
  {
    setNum: "75192",
    name: "Millennium Falcon\u2122",
    numParts: 7541,
    year: 2017,
    theme: "star-wars",
    setImgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD-n1ue9uFx_Hq4owK4RO_oMq6W7KTPl66KMj9bpy-Rbx5P2ex_24XY6UFNAZ_C08c1Ee-P_xRZ1rjVvz1b60GIYNCkA_CtXo-V-UrROBE46NL70vqJuc1AHRrGoLdbpvXbbDXmnBdWrnIlOAxmFsteHc0JO8y5d6ii3z1bb1ZjCU--qK4QjsMlDlgqMuyS7oGOBg7DpLbUzr-3y5l6jcZ7SzefwwIAOEC5afO9BGA_2UuLkhZvF0uSorSVUVqSsptNiVYm0sv7y7AY",
  },
  {
    setNum: "21333",
    name: "The Starry Night",
    numParts: 2316,
    year: 2022,
    theme: "ideas",
    setImgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA1juGR0iHYojtzwCSycaIe-hG000XQ_4U9FTiw4UCSM-ssD6BnOUfBHTfbI_NXn2xJlLeJsStdVZZv0oXNdLBX3shOnBRFLCGnQhSKzjhKCE1GHNcSb9HFiRwrdo6oyA621IDAe0oNkqvvTNX7GdCwW4d2nraFSJ4LeJT749KxmowXV9mKSdKozKyhai25Zz7GA0Z3A3miQynr7x3fFYYxP1zqc5P_3TuXoAZpVyuwZmpUKjCFL3ryEuGxphvWQO2twb01BLS49Xs4",
  },
  {
    setNum: "42141",
    name: "McLaren Formula 1\u2122",
    numParts: 1432,
    year: 2022,
    theme: "technic",
    setImgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCqug7UsW0NxBicBnm5Kszh2WWHwcOr7uuvJDoflyD52ovCOHeTyYDLGTKWWbGmVvPOlAnTSQX_zsVFHmFaJWNLtfGK9qP5ZJ7F17koKVlZo4m7vUl05F58X7OssokA8XR7T5KHwRuAmRjKjPtS4lzGjP-4WZVXUJNrYmUUfQM_dSxErcBRpX5Wvk4P1_96MYchb6iMddkJeD7ZziSyvV7mP2qPu_WH1ZXzp8jOI7chVVY3-Dz4pbr95cu7nRaSe08u9Ty2emz4SujQ",
  },
  {
    setNum: "71043",
    name: "Hogwarts\u2122 Castle",
    numParts: 6020,
    year: 2018,
    theme: "harry-potter",
    setImgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAIRwLNMoUV3ACPPuDFysm0LOtakkdDFnI0YTCr0tvp0YvE4phQfkeWuk4WWqlpWP1wYdCMtkjdCNOhLoVmlKIBNJDpkprZTiLLyo5UfhWR3qUlv9PtNMYHVV8k--yFe5Av9BsW5zB8i3KLxXT2GhUK1RlRhcH74T1TJFuzJ1s4C8TsZuJk41_fVN6FaMlcE3p1LCKdwKFg4PMbmRQw4_FAfvvHU_xGUJd3B4Fd_gFxtzrATmk_DgGQuByZwCu7HxBAJ4_yhO-O2QNW",
  },
  {
    setNum: "10307",
    name: "Eiffel Tower",
    numParts: 10001,
    year: 2022,
    theme: "icons",
    setImgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCpDafAh7qglXaRKJD7_3M7wW6FrL73vZQwul1BM2U55DydoTeteU5wQPs1j5ewq2DesBXdFfFRK9pLyuWxGJj4jmIfyzM7hPmCAIQxVZ42H2_VVrEshVYy1AVf7gjILkP0B-6uhH5w6OkO-HEE3wuUZ8V20WCUKlFRs9LCOE3pEtq51uDr_mKO4RjqQjQigNo5ldYOjg4cwlDMKaAws6W9LVJSc-ury4wRTfHSZQti75-NVvYn6Erw055im5rj2Pdqn7w2PXRQ8OtQ",
  },
  {
    setNum: "21327",
    name: "Typewriter",
    numParts: 2079,
    year: 2021,
    theme: "ideas",
    setImgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDr40Hd4VngUa1v0NwbqqRzm0Q5Df06HPkmNEz1-dTOxF2m_n9bbTSeWHGEzD5gya0ilui0hipfyA6qG1wulId94qnFvbaq868HFWp4xvpxwsB-7R8YM1sk0dYOdR6GPhjBHExeKCc5a0wNFNrgSRryvXMvA_4274DVF115tG7JC8d5B2rgpVxzKXsllCqX3NtcxHYcrXvSdKMrkWxL-VzTOk1lsWYoRMZcmp7iJczOfc4ZzV0_oy7xJkRXMJwsCpB1iW8HU2-Zh2cr",
  },
  {
    setNum: "10497",
    name: "Galaxy Explorer",
    numParts: 1254,
    year: 2022,
    theme: "icons",
    setImgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBlZhG33-0xtTjoSVSuZh2a6wmTkrlHVpvkhzJ1ysuWrLHatCbx18U1ddkO-XQbJtJ6gpEIK-2o4kLRzockbYZImFnTiC4_eVbCiPEK9rDKGab0khPXD2k_XPoEXgD4f6Y5Csy6XYC1CwSLebwsnnuSOO1pqn8t2G9uTV4t9rLsI-F-ugLff52zr5BviMPKUvyf-ViP7n9ak9re0VReDsre0RbnuWjxQ_R-vUztu6RpjMe6KSlEZ1phvK0gJvEGJhhpdVzXqxDtA6eL",
  },
];

export const mockVaultStats: VaultStats = {
  totalValue: "$42,850.32",
  totalPieces: "845,212",
  uniqueThemes: 28,
};

export const mockVaultSets: VaultSet[] = [
  {
    setNum: "75192",
    name: "Millennium Falcon\u2122",
    year: 2017,
    numParts: 7541,
    setImgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBhY4K7Go2_YNkFAbzGsmBx0UKkEk5drzm7g3qTJ41obkUUG31u3HYhxUk-xUdbLb5TRI_KkkTiOWKDjP1lNw3eOJgzX4BoUPgs4ohwiZ1Coc-kLj5QP_zdu-DAvNNFCpsqiA9tJxGHaDbHYfuK5B5FNLlcHlXIoX0yC6jcX0e7lDgHBOjWXiHo1FtAaElHav8Ow31dmx9noZyJ4fVUjZIi7rxEzrxrnn1-4wAy1EC7HY3pn7rd6OTYPdEV2i9nY2TIAMDp2Ax9gptj",
    price: "$849.99",
    status: "built",
    themeName: "Star Wars",
    collectionType: "collection",
    isFavorite: false,
  },
  {
    setNum: "10307",
    name: "Eiffel Tower",
    year: 2022,
    numParts: 10001,
    setImgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDUi1_YZk4xU9oI1i7UrFQ2ShOJOjgNNl59J9CmIYCBv93Qso-yDa1gZvKfbw93iQTk62F5MvU4aQB31tTadq6a5uNAijy--j6MXaBG-t3gt4jLuVBALJhd4NVbXDzzBufGB-y1F6vkqvxw5PNj1qRLB-UBxXi-FsWp6VPhUyVYw9KcXNcHNpUEYMJ6J4bBsm7ejgH6dxdOSTUZvN7ACJY7ieLE-DD36x5Wsx6r_xUkPpjJV1qf5ivgDwdRUUtHLwvJbv3iyZZOEdVW",
    price: "$629.99",
    status: "in-box",
    themeName: "Icons",
    collectionType: "collection",
    isFavorite: false,
  },
  {
    setNum: "10294",
    name: "Titanic",
    year: 2021,
    numParts: 9090,
    setImgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDTOm544GICKazkLOR4XwI1icdRyi4I0Rcjo57hPrIJpNc5_ipj9YBlHokrqmXyf6o0wWniIF-anVVm4JShweHHjw4ji8zGD6oSOhzIVPprrnCGpYFOV9yLul5yPHIvmfDK0nEFOSQTAwazDflSn2YedmAhULmCUgEF6foTHt8mZctpXEB_4ygu4pqyXdYkXBlCjtXGJDbOddLv8hs_jMLk-LxTBCHapqGEffkye1VOPkvdK70902DYSI8W37vqnP5WCCfR6xptTaK3",
    price: "$679.99",
    status: "built",
    themeName: "Icons",
    collectionType: "collection",
    isFavorite: false,
  },
  {
    setNum: "10305",
    name: "Lion Knights\u2019 Castle",
    year: 2022,
    numParts: 4514,
    setImgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC3080c2qWrJU1aq1uM7SkxA9SySQ0QL6Gu6_vZfbwuj3fylCP9JaDmn-R_ox0NuqAEEcLvRoy7qYxjZzI4DzmPHNEVCXvtLcMxfNIoqnyY0U4ts-cSUR3MZudcMUs3Vt3LqURj2H3OyzxN8acmRAQgYnNCJ2AJpkBTiKT3PlcpnxMqLw8SkoF3bwEcuAmFp2jTOxcg593aplxgIMUFpw7uiupQrnM2uCl8pJMmWoNFqLYZ7tksN1GHklS1iZRS68ByNaGxPvQImaXF",
    price: "$399.99",
    status: "missing-parts",
    themeName: "Icons",
    collectionType: "wishlist",
    isFavorite: false,
  },
];
