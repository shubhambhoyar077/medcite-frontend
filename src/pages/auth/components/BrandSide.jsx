import { SypherLogo } from '../../../constants/ImageData';

const BrandSide = () => {
  return (
    <div
      className="hidden lg:flex lg:w-1/2 p-12 items-center justify-center relative overflow-hidden"
      style={{ background: 'var(--color-dark-bg-from)' }}
    >
      {/* Subtle brand-colored glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[-80px] left-[-80px] w-96 h-96 rounded-full blur-[120px] opacity-20"
          style={{ background: 'var(--color-brand-green)' }}
        />
        <div
          className="absolute bottom-[-80px] right-[-80px] w-96 h-96 rounded-full blur-[120px] opacity-20"
          style={{ background: 'var(--color-brand-blue)' }}
        />
      </div>

      <div className="relative z-10 max-w-md">
        {/* Logo + name */}
        <div className="mb-10">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6"
            style={{
              background: 'var(--color-dark-surface-from)',
              border: '1px solid var(--color-dark-border)',
            }}
          >
            <img src={SypherLogo} alt="Sypher Logo" className="w-9 h-9" />
          </div>

          <h1 className="text-5xl font-bold mb-4" style={{ color: 'var(--color-dark-text-primary)' }}>
            Sypher
          </h1>

          {/* Brand gradient underline */}
          <div
            className="h-1 w-16 rounded-full"
            style={{ background: 'linear-gradient(135deg, var(--color-brand-green), var(--color-brand-blue))' }}
          />
        </div>

        {/* Tagline */}
        <p className="text-xl leading-relaxed mb-10" style={{ color: 'var(--color-dark-text-muted)' }}>
          A deterministic AI built for{' '}
          <span
            className="font-semibold bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(135deg, var(--color-brand-green), var(--color-brand-blue))' }}
          >
            medical coders.
          </span>
        </p>

        {/* Feature pills */}
        <div className="flex flex-col gap-3">
          {['Accurate ICD-10 & CPT coding', 'HIPAA-compliant & secure', 'Built for clinical workflows'].map((feat) => (
            <div
              key={feat}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{
                background: 'var(--color-dark-surface-from)',
                border: '1px solid var(--color-dark-border)',
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: 'var(--color-brand-green)' }}
              />
              <span className="text-sm" style={{ color: 'var(--color-dark-text-muted)' }}>
                {feat}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandSide;