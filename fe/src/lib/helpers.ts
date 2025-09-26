import { v4 as uuidv4 } from "uuid";


export const resizeImage = (file: any, maxWidth: any, maxHeight: any) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d") as any;

      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.8);
    };
  });
};

export function formatNumber(value: any) {
  return (value || "0").toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export const formatTime = (
  createdAt: string | number | Date,
  lang: "vi" | "en" | "zh" = "vi"
) => {
  const locales: Record<string, string> = {
    vi: "vi-VN",
    en: "en-US",
    zh: "zh-CN",
  };
  const timezoneMap: Record<string, string> = {
    vi: "Asia/Ho_Chi_Minh",
    en: "America/New_York", // hoặc 'UTC' tùy bạn
    zh: "Asia/Shanghai",
  };

  return new Date(createdAt).toLocaleTimeString(locales[lang], {
    timeZone: timezoneMap[lang],
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export function getUrl(pathname: string) {
  let { hostname, protocol, port } = window.location;
  let portString = "";
  if (port !== "80" && port !== "443" && port !== "") {
    portString = ":" + port;
  }
  return protocol + "//" + hostname + portString + "/" + pathname;
}
export function getJSONFromUrl() {
  try {
    let search = window.location.search.substring(1);
    let json = JSON.parse(
      '{"' +
        decodeURI(search)
          .replace(/"/g, '\\"')
          .replace(/&/g, '","')
          .replace(/=/g, '":"') +
        '"}'
    );
    let result = {} as any;
    Object.keys(json).forEach((key: any) => {
      result[decodeURIComponent(key)] = decodeURIComponent(json[key]);
    });
    return result;
  } catch (e) {
    return {};
  }
}

export const removeLocalStoreageUser = () => {
  window.localStorage.removeItem("accessToken");
  window.localStorage.removeItem("logged");
  window.localStorage.removeItem("refreshToken");
};

export const getDeviceId = () => {
  let deviceId = localStorage.getItem("device_id");
  if (!deviceId) {
    deviceId = uuidv4();
    localStorage.setItem("device_id", deviceId);
  }
  return deviceId;
};


export function formatAddress(
  address: string,
  prefixLength = 6,
  suffixLength = 4
): string {
  if (!address) return "";
  if (address.length <= prefixLength + suffixLength) return address;
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
}

export function hidePhoneNumber(phone: string) {
  return phone.slice(0, -3).replace(/\d/g, "*") + phone.slice(-3);
}


export const getRecaptchaToken = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!window.grecaptcha) {
      return reject(new Error("reCAPTCHA chưa sẵn sàng"));
    }

    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute("6LdW9EArAAAAAEIPGLAn3ERb4KADX8BUKbmTQDwO", {
          action: "register",
        })
        .then((token) => {
          if (!token) return reject(new Error("Không lấy được token"));
          resolve(token);
        })
        .catch((err) => {
          reject(new Error("Lỗi khi thực thi reCAPTCHA: " + err.message));
        });
    });
  });
};