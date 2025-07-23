import { apiSlice } from '../api/apiSlice';

export const eventApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createEvent: builder.mutation({
      query: (data) => ({
        url: 'create-event',
        method: 'POST',
        body: data,
        credentials: 'include' as const,
      }),
      invalidatesTags: ['Event'],
    }),
    getEvents: builder.query({
      query: () => ({
        url: 'events',
        method: 'GET',
        credentials: 'include' as const,
      }),
      providesTags: ['Event'],
    }),
    getShopEvents: builder.query({
      query: (id) => ({
        url: `shop-events/${id}`,
        method: 'GET',
        credentials: 'include' as const,
      }),
      providesTags: ['Event'],
    }),
    getAllEvents: builder.query({
      query: () => ({
        url: 'all-events',
        method: 'GET',
        credentials: 'include' as const,
      }),
      providesTags: ['Event'],
    }),
    deleteShopEvent: builder.mutation({
      query: (id) => ({
        url: `delete-shop-event/${id}`,
        method: 'DELETE',
        credentials: 'include' as const,
      }),
      invalidatesTags: ['Event'],
    }),
  }),
});

export const {
  useCreateEventMutation,
  useDeleteShopEventMutation,
  useGetAllEventsQuery,
  useGetEventsQuery,
  useGetShopEventsQuery,
} = eventApi;