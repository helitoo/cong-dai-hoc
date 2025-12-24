import Avatar from "boring-avatars";

type UserAvatarProps = {
  msg: string;
  variant:
    | "pixel"
    | "bauhaus"
    | "ring"
    | "beam"
    | "sunset"
    | "marble"
    | "geometric"
    | "abstract"
    | undefined;
  isAdmin?: boolean;
  className?: string;
};

export default function UserAvatar({
  msg,
  variant,
  isAdmin = false,
  className = "",
}: UserAvatarProps) {
  return !isAdmin ? (
    <Avatar variant={variant} name={msg} className={className} />
  ) : (
    <div className="inline-flex items-center justify-center rounded-full p-0.5 bg-linear-to-r from-cyan-300 to-sky-500 button">
      <div className="inline-flex items-center justify-center rounded-full p-0.5 bg-background">
        <Avatar name={msg} variant={variant} className={className} />
      </div>
    </div>
  );
}
