const FormHeader: React.FC = ({ children }) => (
  <div className="py-8 sm:mx-auto sm:w-full sm:max-w-md">
    <h2 className="my-8 text-center text-3xl font-extrabold text-gray-900">
      {children}
    </h2>
  </div>
);

export default FormHeader;
