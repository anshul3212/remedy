const Loader = ({ height }: { height?: string }) => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin" />
    </div>
  );
};

export default Loader;
