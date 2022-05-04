import Label from "./Label";

export interface FieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Field: React.FC<FieldProps> = ({ children, error, ...rest }) => (
  <div>
    <Label>
      {children}
      <input
        className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-opium-500 focus:outline-none focus:ring-opium-500 sm:text-sm"
        {...rest}
      />
    </Label>
    {error && <p className="text-red-500">{error}</p>}
  </div>
);

export default Field;
