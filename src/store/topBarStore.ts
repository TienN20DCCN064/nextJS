export type TopBarInfo = {
  title: string;
  phone: string;
  email: string;
  logo: string;
  name: string;
  agency: string;
  address: string;
};

const STORE_KEY = "topbar-info";
let cachedTopBarInfo: TopBarInfo | null = null;

const defaultTopBarInfo: TopBarInfo = {
  title: "ỦY BAN QUỐC GIA VỀ CHUYỂN ĐỔI SỐ",
  phone: "phone ... chưa có",
  email: "email ... chưa có",
  logo: "https://vnanet.vn/Data/Images/logo.png",
  name: "CỔNG THÔNG TIN ĐIỆN TỬ CHUYỂN ĐỔI SỐ QUỐC GIA",
  agency: "Cơ quan thường trực: Văn phòng Ủy ban Quốc gia về chuyển đổi số",
  address: "Tòa nhà VNTA, 68 Dương Đình Nghệ, Cầu Giấy, Hà Nội",
};

const readStore = (): TopBarInfo | null => {
  if (cachedTopBarInfo) {
    return cachedTopBarInfo;
  }
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.sessionStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TopBarInfo;
    cachedTopBarInfo = parsed;
    return parsed;
  } catch {
    return null;
  }
};

const writeStore = (info: TopBarInfo) => {
  cachedTopBarInfo = info;
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORE_KEY, JSON.stringify(info));
  } catch {
    // ignore storage errors
  }
};

export const getTopBarInfoFromStore = (): TopBarInfo | null => {
  return readStore();
};

export const setTopBarInfoInStore = (info: TopBarInfo) => {
  writeStore(info);
};

export const fetchTopBarInfo = async (): Promise<TopBarInfo> => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
  // Force cache bypass with timestamp
  const url = `${baseUrl}/api/v1/pages?t=${Date.now()}`;
  
  try {
    const response = await fetch(url, { cache: "no-store", method: "GET" });
    if (!response.ok) {
      throw new Error(`Failed to fetch pages: ${response.status}`);
    }

    const json = await response.json();
    const data = json.data || json;
    const pages = Array.isArray(data) ? data : [];

    const findRecord = (type: string) => 
      pages.find((p: any) => p.type?.toLowerCase() === type.toLowerCase());

    // Priority: 'icon' type (Base64) > 'logo' type > fallback
    const logoRecord = findRecord("icon") || findRecord("logo");
    const activeLogo = logoRecord?.image || logoRecord?.content || defaultTopBarInfo.logo;

    const info: TopBarInfo = {
      title: findRecord("title")?.content || defaultTopBarInfo.title,
      phone: findRecord("phone")?.content || defaultTopBarInfo.phone,
      email: findRecord("email")?.content || defaultTopBarInfo.email,
      logo: activeLogo,
      name: findRecord("name")?.content || findRecord("title")?.content || defaultTopBarInfo.name,
      agency: findRecord("agency")?.content || defaultTopBarInfo.agency,
      address: findRecord("address")?.content || defaultTopBarInfo.address,
    };

    writeStore(info);
    return info;
  } catch (error) {
    console.error("fetchTopBarInfo failed:", error);
    return defaultTopBarInfo;
  }
};

export const getDefaultTopBarInfo = (): TopBarInfo => defaultTopBarInfo;
