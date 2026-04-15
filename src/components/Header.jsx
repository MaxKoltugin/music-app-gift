import "./Header.css";

const Header = () => {
  return (
    <div className="header">
      <div className="header-logo-group-wrapper">
        <img className="header-logo non-selectable" src={"/logo-big.png"} alt="" />
      </div>
    </div>
  );
};

export default Header;
