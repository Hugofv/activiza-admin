/**
 * Form Input Component for React Hook Form
 */

import { useFormContext, Controller } from 'react-hook-form';
import Input from './InputField';
import Label from '../Label';

interface FormInputProps {
  name: string;
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'time';
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export default function FormInput({
  name,
  label,
  type = 'text',
  placeholder,
  disabled = false,
  required = false,
  className = '',
}: FormInputProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div>
      {label && (
        <Label>
          {label} {required && <span className="text-error-500">*</span>}
        </Label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            error={!!error}
            hint={error?.message as string}
            className={className}
          />
        )}
      />
    </div>
  );
}

