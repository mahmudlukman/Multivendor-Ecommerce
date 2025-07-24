import { apiSlice } from '../api/apiSlice';
import { Order, ProductData, EventData } from '../../../types/index';

interface DashboardStatistics {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  refundOrders: number;
  totalProducts?: number;
  totalEvents?: number;
  totalSales?: number;
  totalUsers?: number;
  totalSellers?: number;
}

interface DashboardCharts {
  orderDistribution: Record<string, number>;
  paymentDistribution?: Record<string, number>;
  productStockLevels?: Record<string, number>;
  categoryDistribution?: Record<string, number>;
}

interface DashboardResponse {
  success: boolean;
  statistics: DashboardStatistics;
  charts: DashboardCharts;
  recentItems: {
    orders: Order[];
    products?: ProductData[];
    events?: EventData[];
  };
}

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserDashboardData: builder.query<DashboardResponse, void>({
      query: () => ({
        url: 'user/dashboard',
        method: 'GET',
        credentials: 'include' as const,
      }),
      providesTags: ['Order', 'Cart'],
    }),
    getSellerDashboardData: builder.query<DashboardResponse, void>({
      query: () => ({
        url: 'seller/dashboard',
        method: 'GET',
        credentials: 'include' as const,
      }),
      providesTags: ['Order', 'Product', 'Event'],
    }),
    getAdminDashboardData: builder.query<DashboardResponse, void>({
      query: () => ({
        url: 'admin/dashboard',
        method: 'GET',
        credentials: 'include' as const,
      }),
      providesTags: ['Order', 'Product', 'Event', 'User', 'Seller'],
    }),
  }),
});

export const {
  useGetUserDashboardDataQuery,
  useGetSellerDashboardDataQuery,
  useGetAdminDashboardDataQuery,
} = dashboardApi;