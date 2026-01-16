import React, { useState } from 'react';
import { Input } from './Input';
import { Button } from './Button';

export interface FormField {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'number';
  placeholder?: string;
  required?: boolean;
}

export interface FormProps {
  title?: string;
  fields: FormField[];
  submitLabel?: string;
  onSubmit?: (data: Record<string, string>) => void;
}

export const Form: React.FC<FormProps> = ({
  title,
  fields,
  submitLabel = 'Submit',
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit?.(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg">
      {title && (
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      )}
      <div className="space-y-4">
        {fields.map((field) => (
          <Input
            key={field.name}
            label={field.label}
            type={field.type || 'text'}
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
            error={errors[field.name]}
          />
        ))}
      </div>
      <div className="mt-6">
        <Button type="submit" variant="primary" size="large" className="w-full">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
