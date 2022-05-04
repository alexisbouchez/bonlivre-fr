import Label from "./Label";

export interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  children,
  ...rest
}) => (
  <div>
    <Label>
      {label}
      <select
        {...rest}
        className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-opium-500 focus:outline-none focus:ring-opium-500 sm:text-sm"
      >
        {children}
      </select>
    </Label>
  </div>
);

export default SelectField;
