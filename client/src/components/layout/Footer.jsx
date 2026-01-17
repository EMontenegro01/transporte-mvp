function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Columna 1: Empresa */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-primary-600 dark:bg-primary-500 p-1.5 rounded">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">TransportLog</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Soluciones integrales de gestión logística y transporte para empresas modernas.
            </p>
          </div>

          {/* Columna 2: Productos */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Productos</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">Gestión de Flota</a></li>
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">Mantenimiento</a></li>
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">Reportes Analytics</a></li>
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">Integraciones</a></li>
            </ul>
          </div>

          {/* Columna 3: Soporte */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Soporte</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">Centro de Ayuda</a></li>
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">Documentación</a></li>
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">Contacto</a></li>
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">Estado del Sistema</a></li>
            </ul>
          </div>

          {/* Columna 4: Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">Términos de Servicio</a></li>
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">Privacidad</a></li>
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">Cookies</a></li>
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">Licencias</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-slate-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {currentYear} TransportLog. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <span className="sr-only">Twitter</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
