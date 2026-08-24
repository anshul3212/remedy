export const TableLoader = ({ colSpan }: { colSpan: number }) => (
  <tbody>
    <tr>
      <td colSpan={colSpan} className="py-10 ">
        <div className="flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"/>
        </div>
      </td>
    </tr>
  </tbody>
);
