import Image from "next/image";
import Link from "next/link";
import { CARD_BASE_CLASSES, CARD_BASE_STYLE } from "./card-styles";

type Props = {
  id: string;
  name: string;
  motto: string;
  image: string;
};

export default function ContributorCard({ id, name, motto, image }: Props) {
  return (
    <Link
      href={`/recipes?contributor=${encodeURIComponent(id)}`}
      className={CARD_BASE_CLASSES}
      style={CARD_BASE_STYLE}
    >
      {image ? (
        <Image
          src={`/images/${image}`}
          alt={name}
          width={320}
          height={480}
          className="w-full h-72 object-cover rounded-t-lg"
        />
      ) : (
        <div
          className="w-full h-72 rounded-t-lg flex items-center justify-center"
          style={{ backgroundColor: "var(--color-cream-light)" }}
        >
          <span
            className="text-6xl font-light"
            style={{ color: "var(--color-text-muted)" }}
          >
            {name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}

      <div className="p-4">
        <h3
          className="text-lg font-medium"
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            color: "var(--color-text-primary)",
          }}
        >
          {name}
        </h3>
        <h4 className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
          {motto}
        </h4>
      </div>
    </Link>
  );
}
