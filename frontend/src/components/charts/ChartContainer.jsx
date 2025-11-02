const ChartContainer = ({ title, children, icon: Icon }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-2 mb-4">
        {Icon && <Icon className="h-5 w-5 text-blue-500" />}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>
      <div className="w-full h-[300px]">
        {children}
      </div>
    </div>
  );
};

export default ChartContainer;
