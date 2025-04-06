// lib/cookieUtils.ts
export const getCookie = (name: string) => {
  const cookie = document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='));
  return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
};

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; Max-Age=-99999999; path=/;`;
};
