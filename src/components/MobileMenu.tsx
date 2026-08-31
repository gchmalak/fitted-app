import NavLinks from "./NavLinks";

type MobileMenuProps = {
  onLinkClickAction: () => void;
};

export default function MobileMenu({ onLinkClickAction }: MobileMenuProps) {
  return (
    <div className="flex flex-col gap-4 px-4 pb-4 bg-pink-darkest ">
      <NavLinks
        className="flex flex-col gap-4"
        onLinkClickAction={onLinkClickAction}
      />
    </div>
  );
}
