import NavLinks from "./NavLinks";

type MobileMenuProps ={
    onLinkClick: ()=>void;
}

export default function MobileMenu({onLinkClick} :MobileMenuProps) {
  return (
    <div className="flex flex-col gap-4 px-4 pb-4 bg-pink-darkest ">
      <NavLinks className="flex flex-col gap-4" onLinkClick={onLinkClick}/>
    </div>
  )
}
