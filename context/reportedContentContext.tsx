// "use client";

// import axios from "axios";
// import {
//   createContext,
//   useContext,
//   useState,
//   ReactNode,
//   useEffect,
// } from "react";
// import toast from "react-hot-toast";

// /* ================= REPORT ITEM ================= */

// export interface ReportItem {
//   id: string;

//   type: "POST" | "COMMENT";

//   content: string;

//   created_at: string;

//   post_id: string;

//   reportsCount: number;
// }

// /* ================= PAGINATION ================= */

// export interface Pagination {
//   currentPage: number;

//   limit: number;

//   total: number;

//   totalPages: number;

//   hasNextPage: boolean;

//   hasPrevPage: boolean;
// }

// /* ================= API RESPONSE ================= */

// export interface ReportResponse {
//   message: string;

//   data: ReportItem[];

//   pagination: Pagination;
// }

// /* ================= CONTEXT TYPE ================= */

// interface ReportContextType {
//   reports: ReportItem[];

//   loading: boolean;

//   reportedPosts: ReportItem[];

//   reportedComments: ReportItem[];

//   fetchReportedContent: () => Promise<void>;

//   /* ================= PAGINATION ================= */

//   page: number;

//   setPage: React.Dispatch<React.SetStateAction<number>>;

//   limit: number;

//   pagination: Pagination | null;
// }

// /* ================= CONTEXT ================= */

// const ReportContext = createContext<ReportContextType | undefined>(undefined);

// /* ================= PROVIDER ================= */

// export function ReportedContentProvider({ children }: { children: ReactNode }) {
//   const [reports, setReports] = useState<ReportItem[]>([]);

//   const [loading, setLoading] = useState(false);

//   const [filter,setFilter] = useState("ALL");

//   /* ================= PAGINATION ================= */

//   const [page, setPage] = useState(1);

//   const limit = 20;

//   const [pagination, setPagination] = useState<Pagination | null>(null);

//   /* ================= FILTERED REPORTS ================= */

//   const reportedPosts = reports.filter((item) => item.type === "POST");

//   const reportedComments = reports.filter((item) => item.type === "COMMENT");

//   /* ================= FETCH ================= */

//   const fetchReportedContent = async () => {
//     const token = document.cookie
//       .split("; ")
//       .find((row) => row.startsWith("admin-token="))
//       ?.split("=")[1];
//     if (!token) return;

//     try {
//       setLoading(true);
//       let url = `/api/getAllReportedContent?page=${page}&limit=${limit}`

//       if(type){
//         url = `&type=${filter}`
//       }

//       const res = await axios.get<ReportResponse>(
//         url,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,

//             "Content-Type": "application/json",
//           },
//         },
//       );

//       /* ================= SET DATA ================= */

//       setReports(res.data.data || []);

//       setPagination(res.data.pagination);
//     } catch (error: any) {
//       const message =
//         error?.response?.data?.message ||
//         error?.response?.data?.error ||
//         error.message ||
//         "Something went wrong";
//       toast.error(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= INIT ================= */

//   return (
//     <ReportContext.Provider
//       value={{
//         reports,

//         loading,

//         reportedPosts,

//         reportedComments,

//         fetchReportedContent,

//         page,

//         setPage,

//         limit,

//         pagination,
//       }}
//     >
//       {children}
//     </ReportContext.Provider>
//   );
// }

// /* ================= HOOK ================= */

// export function useReportedContent() {
//   const ctx = useContext(ReportContext);

//   if (!ctx) {
//     throw new Error(
//       "useReportedContent must be used inside ReportedContentProvider",
//     );
//   }

//   return ctx;
// }









"use client";

import axios from "axios";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import toast from "react-hot-toast";

/* ================= REPORT ITEM ================= */

export interface ReportItem {
  id: string;

  type: "POST" | "COMMENT";

  content: string;

  created_at: string;

  post_id?: string;

  reportsCount: number;
}

/* ================= PAGINATION ================= */

export interface Pagination {
  currentPage: number;

  limit: number;

  total: number;

  totalPages: number;

  hasNextPage: boolean;

  hasPrevPage: boolean;
}

/* ================= API RESPONSE ================= */

export interface ReportResponse {
  message: string;

  data: ReportItem[];

  pagination: Pagination;
}

/* ================= CONTEXT TYPE ================= */

interface ReportContextType {
  reports: ReportItem[];

  loading: boolean;

  fetchReportedContent: () => Promise<void>;

  /* ================= FILTER ================= */

  filter: "ALL" | "POST" | "COMMENT" ;

  setFilter: React.Dispatch<
    React.SetStateAction<"ALL" | "POST" | "COMMENT">
  >;

  /* ================= PAGINATION ================= */

  page: number;

  setPage: React.Dispatch<React.SetStateAction<number>>;

  limit: number;

  pagination: Pagination | null;
}

/* ================= CONTEXT ================= */

const ReportContext = createContext<ReportContextType | undefined>(
  undefined,
);

/* ================= PROVIDER ================= */

export function ReportedContentProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [reports, setReports] = useState<ReportItem[]>([]);

  const [loading, setLoading] = useState(false);

  /* ================= FILTER ================= */

  const [filter, setFilter] = useState<
    "ALL" | "POST" | "COMMENT" 
  >("ALL");

  /* ================= PAGINATION ================= */

  const [page, setPage] = useState(1);

  const limit = 20;

  const [pagination, setPagination] =
    useState<Pagination | null>(null);

  /* ================= FILTERED REPORTS ================= */

  /* ================= FETCH ================= */

  const fetchReportedContent = async () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("admin-token="))
      ?.split("=")[1];

    if (!token) return;

    try {
      setLoading(true);

      let url = `/api/getAllReportedContent?page=${page}&limit=${limit}`;

      /* ================= TYPE FILTER ================= */

      if (filter ) {
        url += `&type=${filter}`;
      }

      const res = await axios.get<ReportResponse>(
        url,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      /* ================= SET DATA ================= */

      setReports(res.data.data || []);

      setPagination(res.data.pagination);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message ||
        "Something went wrong";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= RETURN ================= */

  return (
    <ReportContext.Provider
      value={{
        reports,

        loading,

        fetchReportedContent,

        /* FILTER */

        filter,

        setFilter,

        /* PAGINATION */

        page,

        setPage,

        limit,

        pagination,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
}

/* ================= HOOK ================= */

export function useReportedContent() {
  const ctx = useContext(ReportContext);

  if (!ctx) {
    throw new Error(
      "useReportedContent must be used inside ReportedContentProvider",
    );
  }

  return ctx;
}