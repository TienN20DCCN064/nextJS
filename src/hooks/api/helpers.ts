export const authHeaders = (token?: string) =>
  token ? { Authorization: `Bearer ${token}` } : {};

export const unwrapData = (res: any) => {
  if (!res) return res;
  const statusCode = res?.statusCode ? Number(res.statusCode) : undefined;
  if (statusCode === 401) {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
    throw new Error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.");
  }
  if (statusCode && statusCode >= 400) {
    throw new Error(res?.message || "API error");
  }
  return res?.data ?? res;
};

export const unwrapList = (res: any) => {
  const data = unwrapData(res);
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data?.results ?? [];
};
