import { UserProfile, UserStats } from "@/types/profile";
import { LegoSet } from "@/types/lego-set";
import { NavItem } from "@/types/navigation";
import { FeedPost, Story, TrendingSet, SuggestedUser } from "@/types/feed";

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
  { label: "Profile", href: "/profile", icon: "user" },
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
    actionText: "just added 'The Titanic (10294)' to their shelf!",
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
