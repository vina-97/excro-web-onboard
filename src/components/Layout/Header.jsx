import ImageLoader from "../UI/ImageLoader";

const Header = () => {
  return (
    <header className="onboard-business-header-bg border-border px-7.5 lg:px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm h-15">
      <div className="flex items-center h-full">
        <div className="flex items-center mr-10 h-full py-3">
          <ImageLoader imageKey="excroLogo" className="w-30 h-30" />
        </div>
      </div>
    </header>
  );
};

export default Header;
