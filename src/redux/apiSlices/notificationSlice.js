import { api } from "../api/baseApi";

const notificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args && args.length > 0) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/notifications`,
          method: "GET",
          params,
        };
      },
      providesTags: ["Notifications"],
    }),
    // Legacy collection-based method (kept for backwards compatibility).
    // This mirrors the previous behavior that fetched notifications with
    // `limit=1` and was used as a cheap hint for unread state. New code
    // should prefer `getUnreadCountScalar` below.
    getUnreadCount: builder.query({
      query: () => ({
        url: `/notifications`,
        method: "GET",
        params: { limit: 1 },
      }),
      providesTags: ["Notifications"],
    }),

    // New, lightweight endpoint that returns a scalar integer. Keeps the
    // frontend resilient to slight backend response shapes by normalizing
    // into a single integer.
    getUnreadCountScalar: builder.query({
      query: () => ({
        url: `/notifications/unread-count`,
        method: "GET",
      }),
      transformResponse: (response) => {
        if (typeof response === "number") return response;
        if (response && typeof response.unreadCount === "number")
          return response.unreadCount;
        if (
          response &&
          response.data &&
          typeof response.data.unreadCount === "number"
        )
          return response.data.unreadCount;
        if (response && typeof response.data === "number") return response.data;
        return 0;
      },
      providesTags: ["Notifications"],
    }),
    readNotification: builder.mutation({
      query: () => ({
        url: `/notifications/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useReadNotificationMutation,
  useGetUnreadCountScalarQuery,
} = notificationApi;

export { notificationApi };
