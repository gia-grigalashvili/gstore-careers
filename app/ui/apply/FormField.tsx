type FormFieldProps = {
  label: string;
  name: string;
  error?: string;
  touched?: boolean;
  children: React.ReactNode;
};

export function FormField({ 
  label, 
  name, 
  error, 
  touched, 
  children 
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2 text-sm text-white/80 sm:text-base">
      <label htmlFor={name}>{label}</label>
      {children}
      {touched && error && (
        <p className="text-xs text-red-300 sm:text-sm">{error}</p>
      )}
    </div>
  );
}