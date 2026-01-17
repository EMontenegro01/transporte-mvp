function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            © {currentYear} TransportLog v1.0.0
          </p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400">
              Soporte
            </a>
            <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400">
              Documentación
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
