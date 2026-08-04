import emblemSrc from "../../Designer.png";
import logoSrc from "../../logo.png";

export const siteConfig = {
  universityName: "東京農工大学",
  clubName: "東京農工大学将棋部",
  emblemSrc,
  logoSrc,
  contactEmail: "tuatshogi@gmail.com",
  xUrl: "https://x.com/tuatshogiclub",
  cta: {
    visitDmHref: "https://x.com/tuatshogiclub",
    scheduleHref: "/introduce.html",
  },
};

export const navigationItems = [
  { label: "トップ", href: "/", external: false },
  { label: "入部案内", href: "/entry.html", external: false },
  { label: "大会記録", href: "/record.html", external: false },
  { label: "活動紹介", href: "/introduce.html", external: false },
  {
    label: "X（旧Twitter）",
    href: "https://x.com/tuatshogiclub",
    external: true,
  },
];

export const features = [
  {
    id: "beginner-friendly",
    title: "初心者歓迎",
    description:
      "将棋を始めたばかりでも大丈夫。部員同士でルールや考え方を学び、経験を問わず気軽に参加できます。",
    motif: "歩",
  },
  {
    id: "flexible-schedule",
    title: "柔軟な活動頻度",
    description:
      "授業やアルバイトを優先しながら、自分の予定に合わせて参加できます。無理なく続けられる活動スタイルです。",
    motif: "時",
  },
  {
    id: "playing-environment",
    title: "充実の対局環境",
    description:
      "日々の対局に加え、棋譜検討や研究も行えます。初心者から経験者まで、それぞれが成長できる環境です。",
    motif: "研",
  },
];
