import Image from "next/image";
import Link from "next/link";
import { Dancing_Script } from "next/font/google";

// Google-fonts helper: Dancing Script 600 weight
const dancing = Dancing_Script({
  subsets: ["latin"],
  weight: ["600"],
});

export default function Header() {
  return (
    // full-width bar, 16 px side padding
    <header className="w-full flex items-center px-4 py-3">
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/images/cafe-tm-logo.png"
          width={64}
          height={64}
          alt="Cafe TM logo"
          priority
        />
        <span className={`${dancing.className} text-2xl leading-none`}>
          Cafe&nbsp;TM
        </span>
      </Link>

      {/* Add nav links later by inserting:
          <nav className="ml-auto flex gap-6 text-sm">…</nav> */}
    </header>
  );
}
