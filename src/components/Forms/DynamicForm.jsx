import React, { useState, useEffect } from 'react';

const DynamicForm = ({
  fields = [],
  onSubmit,
  onCancel,
  initialValues = {},
  submitText = 'Submit',
  cancelText = 'Cancel',
  resetText = 'Reset',
  isLoading = false,
  disableSubmitIfUnchanged = false,
  showResetButton = false,
  buttonSize = 'equal',
  buttonAlignment = 'start',
  darkMode = false,
}) => {
  const [formData, setFormData] = useState(() => {
    const initial = {};
    fields.forEach((field) => {
      initial[field.name] =
        initialValues[field.name] !== undefined
          ? initialValues[field.name]
          : field.type === 'checkbox' ? false : '';
    });
    return initial;
  });
  const [errors,   setErrors]   = useState({});
  const [touched,  setTouched]  = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  const v  = (n) => `var(--color-${n})`;
  const dk = darkMode;

  /* ── color tokens ── */
  const labelColor    = dk ? v('dark-text-primary')     : v('neutral-text-primary');
  const helperColor   = dk ? v('dark-text-placeholder') : v('neutral-text-tertiary');
  const errorColor    = v('status-error-text');
  const inputBg       = dk ? v('dark-bg-from')          : v('neutral-bg-primary');
  const inputBgDis    = dk ? v('dark-surface-from')     : v('neutral-bg-secondary');
  const inputColor    = dk ? v('dark-text-primary')     : v('neutral-text-primary');
  const borderNormal  = dk ? v('dark-border')           : v('neutral-border');
  const focusBorder   = v('brand-green');
  const focusShadow   = dk
    ? '0 0 0 3px rgba(61,214,140,0.15)'
    : '0 0 0 3px rgba(61,214,140,0.12)';
  const checkColor    = v('brand-green');
  const dividerColor  = dk ? v('dark-border')           : v('neutral-border');
  const cancelBg      = dk ? v('dark-surface-from')     : v('neutral-bg-secondary');
  const cancelText2   = dk ? v('dark-text-muted')       : v('neutral-text-secondary');

  useEffect(() => {
    const changed = fields.some((field) => {
      const cur = formData[field.name];
      const ini = initialValues[field.name] !== undefined
        ? initialValues[field.name]
        : field.type === 'checkbox' ? false : '';
      if (typeof cur === 'object' && typeof ini === 'object')
        return JSON.stringify(cur) !== JSON.stringify(ini);
      return cur !== ini;
    });
    setHasChanges(changed);
  }, [formData, initialValues, fields]);

  const validateField = (field, value) => {
    if (field.required && !value && value !== 0 && value !== false)
      return `${field.label} is required`;
    if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return 'Please enter a valid email address';
    if (field.type === 'number' && value !== '') {
      if (field.min !== undefined && Number(value) < field.min) return `Minimum value is ${field.min}`;
      if (field.max !== undefined && Number(value) > field.max) return `Maximum value is ${field.max}`;
    }
    if (field.minLength && value && value.length < field.minLength)
      return `Minimum ${field.minLength} characters required`;
    if (field.maxLength && value && value.length > field.maxLength)
      return `Maximum ${field.maxLength} characters allowed`;
    if (field.validate) return field.validate(value, formData);
    return null;
  };

  const handleChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    if (touched[fieldName]) {
      const field = fields.find((f) => f.name === fieldName);
      setErrors((prev) => ({ ...prev, [fieldName]: validateField(field, value) }));
    }
  };

  const handleBlur = (fieldName) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    const field = fields.find((f) => f.name === fieldName);
    setErrors((prev) => ({ ...prev, [fieldName]: validateField(field, formData[fieldName]) }));
  };

  const handleSubmit = () => {
    const newErrors = {};
    const newTouched = {};
    fields.forEach((field) => {
      newTouched[field.name] = true;
      const err = validateField(field, formData[field.name]);
      if (err) newErrors[field.name] = err;
    });
    setErrors(newErrors);
    setTouched(newTouched);
    if (Object.keys(newErrors).length === 0) onSubmit(formData);
  };

  const handleReset = () => {
    const initial = {};
    fields.forEach((field) => {
      initial[field.name] =
        initialValues[field.name] !== undefined
          ? initialValues[field.name]
          : field.type === 'checkbox' ? false : '';
    });
    setFormData(initial);
    setErrors({});
    setTouched({});
  };

  const getAlignmentClass = () => {
    if (buttonSize !== 'auto') return '';
    return { center: 'justify-center', end: 'justify-end', start: 'justify-start' }[buttonAlignment] ?? 'justify-start';
  };

  /* ── shared input style factory ── */
  const inputStyle = (field, hasError) => {
    const editable = field.isEditable !== false;
    return {
      border: `1.5px solid ${hasError ? errorColor : borderNormal}`,
      backgroundColor: editable ? inputBg : inputBgDis,
      color: inputColor,
      opacity: editable ? 1 : 0.55,
      cursor: editable ? 'text' : 'not-allowed',
      outline: 'none',
    };
  };

  const onFocusInput = (e, hasError, editable) => {
    if (!hasError && editable) {
      e.target.style.borderColor = focusBorder;
      e.target.style.boxShadow   = focusShadow;
    }
  };
  const onBlurInput = (e, fieldName, hasError) => {
    handleBlur(fieldName);
    e.target.style.borderColor = hasError ? errorColor : borderNormal;
    e.target.style.boxShadow   = 'none';
  };

  const inputCls = 'w-full px-4 py-2.5 rounded-lg text-sm transition-all duration-150 outline-none';

  /* ── field renderer ── */
  const renderField = (field) => {
    const hasError = !!(touched[field.name] && errors[field.name]);
    const value    = formData[field.name] ?? '';
    const editable = field.isEditable !== false;

    switch (field.type) {

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            onFocus={(e) => onFocusInput(e, hasError, editable)}
            onBlur={(e) => onBlurInput(e, field.name, hasError)}
            placeholder={field.placeholder}
            rows={field.rows || 4}
            disabled={isLoading || !editable}
            readOnly={!editable}
            className={inputCls}
            style={inputStyle(field, hasError)}
          />
        );

      case 'select':
        return (
          <div className="relative">
            <select
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              onFocus={(e) => onFocusInput(e, hasError, editable)}
              onBlur={(e) => onBlurInput(e, field.name, hasError)}
              disabled={isLoading || !editable}
              className={inputCls}
              style={{ ...inputStyle(field, hasError), appearance: 'none', paddingRight: '2.5rem' }}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: helperColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        );

      case 'checkbox':
        return (
          <label className={`flex items-center gap-3 ${editable ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
            <div className="relative flex-shrink-0">
              <input
                type="checkbox"
                checked={value || false}
                onChange={(e) => handleChange(field.name, e.target.checked)}
                disabled={isLoading || !editable}
                className="sr-only"
              />
              <div
                className="w-5 h-5 rounded transition-all duration-150 flex items-center justify-center"
                style={{
                  border: `1.5px solid ${value ? checkColor : borderNormal}`,
                  background: value ? checkColor : 'transparent',
                  opacity: editable ? 1 : 0.55,
                }}
              >
                {value && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm" style={{ color: labelColor, opacity: editable ? 1 : 0.55 }}>
              {field.checkboxLabel || field.label}
            </span>
          </label>
        );

      case 'radio':
        return (
          <div className="space-y-2.5">
            {field.options?.map((opt) => (
              <label key={opt.value} className={`flex items-center gap-3 ${editable ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                <div className="relative flex-shrink-0">
                  <input
                    type="radio"
                    name={field.name}
                    value={opt.value}
                    checked={value === opt.value}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    disabled={isLoading || !editable}
                    className="sr-only"
                  />
                  <div
                    className="w-5 h-5 rounded-full transition-all duration-150 flex items-center justify-center"
                    style={{
                      border: `1.5px solid ${value === opt.value ? checkColor : borderNormal}`,
                      opacity: editable ? 1 : 0.55,
                    }}
                  >
                    {value === opt.value && (
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: checkColor }} />
                    )}
                  </div>
                </div>
                <span className="text-sm" style={{ color: labelColor, opacity: editable ? 1 : 0.55 }}>
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        );

      default:
        return (
          <input
            type={field.type || 'text'}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            onFocus={(e) => onFocusInput(e, hasError, editable)}
            onBlur={(e) => onBlurInput(e, field.name, hasError)}
            placeholder={field.placeholder}
            disabled={isLoading || !editable}
            readOnly={!editable}
            min={field.min}
            max={field.max}
            step={field.step}
            className={inputCls}
            style={inputStyle(field, hasError)}
          />
        );
    }
  };

  const submitDisabled = isLoading || (disableSubmitIfUnchanged && !hasChanges);

  return (
    <div className="space-y-5">
      {/* Fields */}
      {fields.map((field) => (
        <div key={field.name}>
          {field.type !== 'checkbox' && (
            <label className="block text-sm font-medium mb-1.5" style={{ color: labelColor }}>
              {field.label}
              {field.required && <span style={{ color: errorColor }}> *</span>}
            </label>
          )}

          {field.helperText && (
            <p className="mb-1.5 text-xs" style={{ color: helperColor }}>
              {field.helperText}
            </p>
          )}

          {renderField(field)}

          {touched[field.name] && errors[field.name] && (
            <div className="mt-1.5 flex items-center gap-1.5 text-xs" style={{ color: errorColor }}>
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors[field.name]}
            </div>
          )}
        </div>
      ))}

      {/* Actions */}
      <div
        className={`flex gap-3 pt-5 ${getAlignmentClass()}`}
        style={{ borderTop: `1px solid ${dividerColor}` }}
      >
        {onCancel && (
          <button
            onClick={onCancel}
            disabled={isLoading}
            className={`${buttonSize === 'equal' ? 'flex-1' : ''} px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150`}
            style={{
              background: cancelBg,
              color: cancelText2,
              border: `1px solid ${borderNormal}`,
            }}
            onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.background = dk ? 'rgba(255,255,255,0.08)' : v('neutral-border'); }}
            onMouseLeave={(e) => { e.currentTarget.style.background = cancelBg; }}
          >
            {cancelText}
          </button>
        )}

        {showResetButton && (
          <button
            onClick={handleReset}
            disabled={isLoading || !hasChanges}
            className={`${buttonSize === 'equal' ? 'flex-1' : ''} px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150`}
            style={{
              background: cancelBg,
              color: cancelText2,
              border: `1px solid ${borderNormal}`,
              opacity: (!hasChanges || isLoading) ? 0.45 : 1,
              cursor: (!hasChanges || isLoading) ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => { if (!isLoading && hasChanges) e.currentTarget.style.background = dk ? 'rgba(255,255,255,0.08)' : v('neutral-border'); }}
            onMouseLeave={(e) => { e.currentTarget.style.background = cancelBg; }}
          >
            {resetText}
          </button>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitDisabled}
          className={`${buttonSize === 'equal' ? 'flex-1' : ''} px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all duration-150`}
          style={{
            background: submitDisabled
              ? (dk ? 'rgba(255,255,255,0.08)' : v('neutral-border'))
              : `linear-gradient(135deg, ${v('brand-green')}, ${v('brand-blue')})`,
            color: submitDisabled
              ? (dk ? v('dark-text-placeholder') : v('neutral-text-tertiary'))
              : '#ffffff',
            cursor: submitDisabled ? 'not-allowed' : 'pointer',
            opacity: submitDisabled ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!submitDisabled) {
              e.currentTarget.style.opacity = '0.88';
              e.currentTarget.style.boxShadow = `0 4px 16px rgba(61,214,140,0.3)`;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </span>
          ) : submitText}
        </button>
      </div>
    </div>
  );
};

export default DynamicForm;