import {
  define,
  getAccessTokenFromRequest,
  getRefreshTokenFromRequest,
  getUsernameFromRequest,
} from "../utils.ts";

export default define.middleware(async (ctx) => {
  const url = new URL(ctx.req.url);
  const pathname = url.pathname;

  // 인증이 필요하지 않은 경로들
  const publicPaths = [
    "/login",
    "/api/login",
    "/register",
    "/api/register",
    "/api/refresh",
  ];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // 정적 파일들은 인증 체크 제외
  const isStaticFile = pathname.startsWith("/static/") ||
    (pathname.includes(".") && !pathname.endsWith(".tsx") &&
      !pathname.endsWith(".ts"));

  if (isPublicPath || isStaticFile) {
    return await ctx.next();
  }

  // 토큰과 사용자명 확인
  const accessToken = getAccessTokenFromRequest(ctx.req);
  const refreshToken = getRefreshTokenFromRequest(ctx.req);
  const username = getUsernameFromRequest(ctx.req);

  console.log("Auth middleware - Tokens:", {
    accessToken: accessToken ? "present" : "missing",
    refreshToken: refreshToken ? "present" : "missing",
    username: username || "missing",
  });

  // 토큰이나 사용자명이 없으면 로그인 페이지로 리다이렉트
  if (!accessToken || !refreshToken || !username) {
    console.log("Redirecting to login - missing tokens");
    const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
    return new Response(null, { status: 302, headers: { Location: loginUrl } });
  }

  // 인증된 사용자의 경우 사용자 정보를 state에 추가
  ctx.state.user = { username };
  return await ctx.next();
});
