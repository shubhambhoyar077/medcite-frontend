import BrandSide from "./BrandSide";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-dark-bg-via)' }}>
      {/* Brand Side */}
      <BrandSide />

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-12">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <h1
              className="text-4xl font-bold bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, var(--color-brand-green), var(--color-brand-blue))' }}
            >
              Sypher
            </h1>
            <div
              className="h-0.5 rounded-full mt-1 mx-auto w-24"
              style={{ background: 'linear-gradient(135deg, var(--color-brand-green), var(--color-brand-blue))' }}
            />
          </div>

          {/* Card */}
          <div
            className="rounded-2xl p-8 border"
            style={{
              background: 'var(--color-dark-surface-from)',
              borderColor: 'var(--color-dark-border)',
              boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
            }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-dark-text-primary)' }}>
                {title}
              </h2>
              {subtitle && (
                <p className="text-sm" style={{ color: 'var(--color-dark-text-muted)' }}>
                  {subtitle}
                </p>
              )}
            </div>
            {children}
          </div>

          {/* Footer */}
          <p className="text-center text-xs mt-6" style={{ color: 'var(--color-dark-text-placeholder)' }}>
            © 2026 Sypher. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;