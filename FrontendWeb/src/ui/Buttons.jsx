export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  iconPosition = "left",
  className = "",
  isLoading = false,
  disabled,
  ...props
}) {
  const base = `
    rounded-full font-semibold transition-all duration-300
    shadow-md hover:shadow-lg
    flex items-center justify-center gap-2
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-[0.98]
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryBlue-start/50
  `

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  }
  
  const variants = {
    // Variante principale (Bleu - pour les actions principales)
    primary: `
      bg-gradient-to-r from-primaryBlue-start to-primaryBlue-end 
      text-white 
      hover:scale-[1.02] hover:shadow-xl
      active:from-primaryBlue-start/90 active:to-primaryBlue-end/90
    `,
       // Variante principale (Bleu - pour les actions principales)
    gradientMix: `
      bg-gradient-to-r from-primaryGreen-start to-primaryBlue-start
      text-white 
      hover:scale-[1.02] hover:shadow-xl
      focus:ring-primaryBlue-start/50
      active:from-primaryGreen-start/90 active:to-primaryBlue-start/90
    `,
   
    
    // Variante secondaire (Vert - pour les actions secondaires importantes)
    secondary: `
      bg-gradient-to-r from-primaryGreen-start to-primaryGreen-end 
      text-white 
      hover:scale-[1.02] hover:shadow-xl
      active:from-primaryGreen-start/90 active:to-primaryGreen-end/90
    `,
    
    // Variante d'accent (Mélange bleu/vert - pour les actions spéciales)
    accent: `
      bg-gradient-to-r from-primaryBlue-start to-primaryGreen-end 
      text-white 
      hover:scale-[1.02] hover:shadow-xl
      active:from-primaryBlue-start/90 active:to-primaryGreen-end/90
    `,
    
    // Variante outline (Pour les actions alternatives)
    outline: `
      bg-transparent 
      border-2 border-primaryBlue-start 
      text-primaryBlue-start 
      hover:bg-primaryBlue-start/10 
      hover:text-primaryBlue-end
      active:bg-primaryBlue-start/20
    `,
    
    // Variante ghost (Pour les actions discrètes)
    ghost: `
      bg-transparent 
      text-primaryBlue-start 
      hover:bg-primaryBlue-start/10 
      active:bg-primaryBlue-start/20
      shadow-none hover:shadow-none
    `,
  }

  const widthClass = fullWidth ? "w-full" : "w-auto"
  const isDisabled = disabled || isLoading

  return (
    <button
      className={`
        ${base} 
        ${sizes[size]} 
        ${variants[variant]} 
        ${widthClass} 
        ${isLoading ? 'cursor-wait' : ''}
        ${className}
      `.trim()}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          <span className="opacity-80">Chargement...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && icon}
          {children}
          {icon && iconPosition === "right" && icon}
        </>
      )}
    </button>
  )
}

// Exemple d'utilisation avec un design cohérent
export function ButtonShowcase() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">


      {/* Section  principales */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-700">Actions principales</h2>
        <div className="grid grid-cols-1 md-cols-2 gap-6">
          <div className="space-y-4">
            <div className="text-sm font-medium text-gray-500">Action principale</div>
            <Button variant="primary" size="lg" fullWidth>
              Se connecter
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              Pour les actions principales comme la connexion, inscription, etc.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="text-sm font-medium text-gray-500">Action secondaire importante</div>
            <Button variant="secondary" size="lg" fullWidth>
              Télécharger
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              Pour les actions secondaires mais importantes comme le téléchargement, sauvegarde, etc.
            </p>
          </div>
        </div>
      </section>

      {/* Section  les variantes */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-700">Toutes les variantes</h2>
        <div className="flex flex-wrap gap-4 items-center p-6 bg-gray-50 rounded-xl">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </section>

      {/* Section  */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-700">Tailles disponibles</h2>
        <div className="flex flex-wrap items-center gap-4 p-6 bg-gray-50 rounded-xl">
          <Button variant="primary" size="sm">Petit</Button>
          <Button variant="primary" size="md">Moyen</Button>
          <Button variant="primary" size="lg">Grand</Button>
          <Button variant="primary" size="xl">Très grand</Button>
        </div>
      </section>

      {/* Section  icônes */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-700">Avec icônes</h2>
        <div className="grid grid-cols-1 md-cols-2 gap-6">
          <Button 
            variant="primary" 
            size="lg"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            }
            iconPosition="left"
            fullWidth
          >
            Se connecter
          </Button>
          
          <Button 
            variant="secondary" 
            size="lg"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            }
            iconPosition="right"
            fullWidth
          >
            Télécharger
          </Button>
        </div>
      </section>

      {/* Section  */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-700">États</h2>
        <div className="grid grid-cols-1 md-cols-3 gap-6">
          <div className="space-y-4">
            <Button variant="primary" fullWidth>Normal</Button>
            <p className="text-sm text-gray-500 text-center">État par défaut</p>
          </div>
          
          <div className="space-y-4">
            <Button variant="primary" disabled fullWidth>
              Désactivé
            </Button>
            <p className="text-sm text-gray-500 text-center">Action non disponible</p>
          </div>
          
          <div className="space-y-4">
            <Button variant="primary" isLoading fullWidth>
              Action
            </Button>
            <p className="text-sm text-gray-500 text-center">Chargement en cours</p>
          </div>
        </div>
      </section>

      {/* Section  en contexte */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-700">Exemple en contexte</h2>
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
          <div className="max-w-md mx-auto space-y-6">
            <h3 className="text-xl font-bold text-center">Tableau de bord</h3>
            
            <div className="space-y-4">
              <Button variant="primary" size="lg" fullWidth>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Accéder au tableau de bord
              </Button>
              
              <Button variant="secondary" size="md" fullWidth>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Exporter les données
              </Button>
              
              <div className="flex gap-3 pt-4">
                <Button variant="outline" size="sm">
                  Paramètres
                </Button>
                <Button variant="ghost" size="sm">
                  Aide
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}