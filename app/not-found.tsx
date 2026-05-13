

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-gray-500 mt-2">Page not found</p>

      {/* <Link
        href="/dashboard"
        className="mt-4 px-4 py-2 bg-purple-500 text-white rounded"
      >
        Go To Dashboard
      </Link> */}
    </div>
  );
}