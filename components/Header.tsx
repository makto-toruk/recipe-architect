import Image from "next/image";
import Link from "next/link";
import { Dancing_Script } from "next/font/google";

const dancing = Dancing_Script({
  subsets: ["latin"],
  weight: ["600"],
});

export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-3 max-w-6xl mx-auto">
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
    </header>
  );
}
