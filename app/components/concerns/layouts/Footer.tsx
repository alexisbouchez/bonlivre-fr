const Footer: React.FC = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  return (
    <footer className="sticky top-[100vh] bg-opium-50 shadow">
      <div className="mx-auto max-w-7xl py-10 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-base text-opium-700">
            &copy; Copyright {currentYear} - Software Citadel. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
