export const IconCircle = ({ children, color }) => (
  <div
    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
    style={{ background: color, boxShadow: `0 8px 24px ${color}44` }}
  >
    {children}
  </div>
);
