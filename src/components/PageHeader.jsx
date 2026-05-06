/**
 * PageHeader Component
 * 
 * A sticky header component for page titles and actions.
 * Stays fixed below the topbar while page content scrolls underneath.
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Page title (required)
 * @param {string} [props.subtitle] - Optional subtitle or description
 * @param {React.ReactNode} [props.actions] - Action buttons or components to show on the right
 * @param {React.ReactNode} [props.breadcrumbs] - Breadcrumb navigation
 * @param {boolean} [props.showDivider=false] - Show bottom border/divider
 * @param {string} [props.className] - Additional CSS classes
 * @param {Object} [props.style] - Additional inline styles
 * 
 * @example
 * // Simple page header
 * <PageHeader title="Dashboard" />
 * 
 * @example
 * // With subtitle and actions
 * <PageHeader 
 *   title="Users" 
 *   subtitle="Manage team members"
 *   actions={
 *     <button className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm">
 *       Add User
 *     </button>
 *   }
 * />
 * 
 * @example
 * // With breadcrumbs
 * <PageHeader 
 *   title="Project Details"
 *   breadcrumbs={
 *     <div className="flex items-center gap-2 text-xs">
 *       <a href="/projects" className="hover:underline">Projects</a>
 *       <span>/</span>
 *       <span>Project Details</span>
 *     </div>
 *   }
 * />
 */

import React from 'react';

const PageHeader = ({
  title,
  subtitle,
  actions,
  breadcrumbs,
  tabs,
  showDivider = false,
  className = '',
  style = {}
}) => {
  return (
    <div 
      className={`sticky -mt-16 z-1 -mx-4 md:-mx-8 mb-6 md:mb-8 ${className}`}
      style={{
        top: '64px', // Stick below 64px (h-16 = 4rem = 64px) topbar
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        ...style
      }}
    >
      <div className="px-4 md:px-8 py-3">
        {/* Breadcrumbs */}
        {breadcrumbs && (
          <div className="mb-1.5 text-xs text-gray-500">
            {breadcrumbs}
          </div>
        )}

        {/* Title and Actions Row */}
        <div className="flex items-center justify-between gap-3">
          {/* Title Section */}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg md:text-xl font-semibold text-gray-900 truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-0.5 text-xs md:text-sm text-gray-600 line-clamp-1">
                {subtitle}
              </p>
            )}
          </div>

          {/* Actions Section */}
          {actions && (
            <div className="flex-shrink-0">
              {actions}
            </div>
          )}
        </div>

        {/* Tabs Section */}
        {tabs && (
          <div className="mt-3 -mb-3">
            {tabs}
          </div>
        )}
      </div>

      {/* Divider */}
      {showDivider && (
        <div className="h-px bg-gray-200" />
      )}
    </div>
  );
};

export default PageHeader;