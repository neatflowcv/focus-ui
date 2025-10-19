import { createDefine } from "fresh";

// This specifies the type of "ctx.state" which is used to share
// data among middlewares, layouts and routes.
export interface State {
  user?: {
    username: string;
  };
}

export const define = createDefine<State>();

// 쿠키 파싱 헬퍼 함수
function parseCookies(req: Request): Record<string, string> {
  const cookieHeader = req.headers.get("cookie");
  console.log("Cookie header:", cookieHeader);
  if (!cookieHeader) return {};

  const cookies = cookieHeader.split("; ").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=");
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  console.log("Parsed cookies:", cookies);
  return cookies;
}

// 토큰 관리 유틸리티 함수들
export function getAccessTokenFromRequest(req: Request): string | null {
  return parseCookies(req).access_token || null;
}

export function getRefreshTokenFromRequest(req: Request): string | null {
  return parseCookies(req).refresh_token || null;
}

// 쿠키에서 username 가져오는 함수
export function getUsernameFromRequest(req: Request): string | null {
  return parseCookies(req).username || null;
}

// 공통 쿠키 설정 헬퍼
function createCookieHeader(
  name: string,
  value: string,
  maxAge: number,
): string {
  return `${name}=${value}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

export function createTokenResponse(
  accessToken: string,
  refreshToken: string,
  username: string,
  redirectUrl: string = "/",
): Response {
  const headers = new Headers();

  // 각 쿠키를 개별적으로 설정
  headers.append(
    "Set-Cookie",
    createCookieHeader("access_token", accessToken, 3600),
  );
  headers.append(
    "Set-Cookie",
    createCookieHeader("refresh_token", refreshToken, 604800),
  );
  headers.append(
    "Set-Cookie",
    createCookieHeader("username", username, 604800),
  );

  headers.set("Location", redirectUrl);

  console.log("Redirecting to:", redirectUrl);
  console.log("Set-Cookie headers:", headers.get("Set-Cookie"));
  return new Response(null, { status: 302, headers });
}

export function createTokenRefreshResponse(
  accessToken: string,
  refreshToken: string,
  username: string,
): Response {
  const headers = new Headers();

  // 각 쿠키를 개별적으로 설정
  headers.append(
    "Set-Cookie",
    createCookieHeader("access_token", accessToken, 3600),
  );
  headers.append(
    "Set-Cookie",
    createCookieHeader("refresh_token", refreshToken, 604800),
  );
  headers.append(
    "Set-Cookie",
    createCookieHeader("username", username, 604800),
  );

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      ...Object.fromEntries(headers),
      "Content-Type": "application/json",
    },
  });
}

export function createLogoutResponse(): Response {
  const headers = new Headers();

  // 각 쿠키를 개별적으로 설정 (삭제)
  headers.append("Set-Cookie", createCookieHeader("access_token", "", 0));
  headers.append("Set-Cookie", createCookieHeader("refresh_token", "", 0));
  headers.append("Set-Cookie", createCookieHeader("username", "", 0));

  headers.set("Location", "/login");
  return new Response(null, { status: 302, headers });
}
