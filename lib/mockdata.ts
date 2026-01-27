import { UserProfile, UserStats } from "@/types/profile";
import { LegoSet, ThemeFilter } from "@/types/lego-set";
import { NavItem } from "@/types/navigation";

export const mockUser: UserProfile = {
  id: "1",
  username: "BrickMaster99",
  fullName: "Brick Master",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCeJWvCVeQkR5pqZR2bTcpHH_sCIsY6OavTtiIrzyOIRlsIvOSh7v-2PT6if05t5a1wMin8Fh0wIUxIv_lC0fvru9soZTqZ8IU4WY1QtmX7P5XCC51Hs1dXMjQ-vLAZsxbjit8P2Lc3UUhxoxx-ge1zWFKnI3EslDjNjTtxsqDyAJ8Zqick8bamzsgWuYwZ0e4LqlJbXg8TFjI8xvblmHeXIBBjOW0dOSF-hBYNtLy8Wv2xi3-no95Ccry4ArSEB9JPHqH7SNbrb8I",
  bio: "AFOL | Castle Theme Enthusiast | 80s Kid",
  isVerified: true,
};

export const mockUserStats: UserStats = {
  setsCount: 142,
  piecesCount: 85000,
  rank: "Expert",
};

export const mockNavItems: NavItem[] = [
  { label: "Home", href: "/", isActive: false },
  { label: "Discover", href: "/discover", isActive: false },
  { label: "Profile", href: "/profile", isActive: true },
];

export const mockThemeFilters: ThemeFilter[] = [
  { id: "all", label: "All Sets", isActive: true },
  { id: "castle", label: "Castle", isActive: false },
  { id: "space", label: "Space", isActive: false },
  { id: "technic", label: "Technic", isActive: false },
];

export const mockLegoSets: LegoSet[] = [
  {
    setNum: "10305",
    name: "Lion Knights' Castle",
    year: 2022,
    themeId: 186,
    numParts: 4514,
    setImgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCm6ssRDjHTJZwq2tN32Y6zYQgEJyLN2jy9XUb5whdwb7Q-NJXf6bhKFenq52-d5oOCuPHdlz6v_f6kvOg76OTzdLWn_fhk8J55dtKlpr4f786VbdJEZBy0cDEL2xphLJiI7-HkVJso7nKHy-5vmH5BUkzhFWFF6bfF5BWsD2AgHrSHA4BaqkLVqIvjyVUC6dCxzseg6xdnKL_o15bX46LvWoaBtH-T16gYCo08_9i1eXyB3bx4wE_tbbjdGjJf9Y0Cw-qFG9flJ0Y",
    isFavorite: false,
  },
  {
    setNum: "10497",
    name: "Galaxy Explorer",
    year: 2022,
    themeId: 130,
    numParts: 1254,
    setImgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDmP7BwtDOFXmobDnyx0vcivbZ52bsPfwS6aQmCRS3xxa2x9rEhLP1yFvHaVMhTXVuSu2mJQKIh0i6IVD6kotkpOmpc1bR-1e3-5XGP1c2FNyluDQJQJqOqpu2uQvkKmyS0rKNCU5UXHsX55Ehsk-Z2kOd5ph-hfJka-SbmPE6sDu65wYgdCJJdoVwYMiHMmlUWpe3d2wr4k5FYgm_RhiVTyWUbwbUEV-XnzDRFj-gX_bOdw0HIVspT3qJKSrDyH-QYYH3OAGtCapY",
    isFavorite: true,
  },
  {
    setNum: "10316",
    name: "Rivendell",
    year: 2023,
    themeId: 561,
    numParts: 6167,
    setImgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDnqzEAzjFHMOUjfNsYW6ozDhiBfdQ5mIWAYCnIFL2cRmVhoMCGDw1NA3kAp3CP1qMXtX_-CnjDsX_N6SPuz7U0SElMvMbiS15Cj261RxI83eAWQhwQb-dsMADUfYT2TiTW_hH3hMEwI3Dilm6eH8SP0ZHoop9mTkiuCPGTlvWYjBuhH5f8H54AFTloITR4caR1RbkAoGyQMGL-po-7WLERUzLSOkGT5u7PwEUe9gLlg5iVJDTQrP-e-HlcSFHlBn0Ahc7DZFurjq4",
    isFavorite: false,
  },
  {
    setNum: "10320",
    name: "Eldorado Fortress",
    year: 2023,
    themeId: 158,
    numParts: 2509,
    setImgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAXSP_fUyjDyvm4Bfsx7SITBXYowBA1tjTVRB2K2WHySvaTjvxxYzrnr1gBgWlJS_pZgH6U6PfQRDZgc1b-T8xDrguNHOCWmSgfipDR3e567UTnFyuNhwsh-BdePjawgnKR2gcHg4O9bjA5i21WEWUbsphJiJ4mXVyHpCiqlO_WJPweYvJ_D6S8Y7pGqskyQ-Wm6IOFd6NzSaXb_snVVLuzuFhWm-lJMZwqvVkU4C3dqBBNuKZEWiUAGXrxDFgZYnGeeTwTQirOtF4",
    isFavorite: false,
  },
  {
    setNum: "21325",
    name: "Medieval Blacksmith",
    year: 2021,
    themeId: 576,
    numParts: 2164,
    setImgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB51xAjPkfpS5y5pkACcx3QyHHPSSilanLIA5X2yI_xryeIdi0DEg24-kt4KRdRqD_72YWmubweqJ4QKlfv6Vrat-XFPnrJKb0DsI8FjfAb-LR_gf5nTF4RQip_S_T6cVSemDxt6fP_w2Ak_hgvHjYaOA-8fBY7q8Z5x6z57WKBacicwmHLWdeqpBbpKnS1397yzHnh9WPSNOeud2X489yrJQ5CgzcSjCwzajZZv3fq_TP_fffDK0O2mklt9Jyy40me_DLRHQlJQ8Q",
    isFavorite: false,
  },
  {
    setNum: "10300",
    name: "Back to the Future Time Machine",
    year: 2022,
    themeId: 610,
    numParts: 1872,
    setImgUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD0mwzOhelCQl85bjax_xFyKF_F1yWUUyQvgamkDtiXU7nOkr7hHyMHX8ANRjYLJd08GnKYCtqaTd6RSCHG9HqFLc_knFrfnn_fglMZsa0y660UpbPi34G_ZaCskRL2beyR6BHzrTYrDec0K9nnUW3zxoQqrTNRtaroEP0xq8MIGXW3lkpxHaEawemji0sXxjsWsIZcXQWnOtIoALan7QzppDMYquKH-RVfXnvTQkQIRmN6RhQ-ynGb4nvsqLOgWs9XlNc0fL5Hj5Y",
    isFavorite: false,
  },
];
