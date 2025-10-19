import { define } from "../utils.ts";
import { Head } from "fresh/runtime";

export default define.page(function Login(ctx) {
  // URL 파라미터를 안전하게 가져오기
  let errorMessage = "";
  let _redirectParam = "";

  try {
    const url = new URL(ctx.req.url);
    const errorParam = url.searchParams.get("error");
    _redirectParam = url.searchParams.get("redirect") || "";

    if (errorParam === "invalid_credentials") {
      errorMessage = "사용자 이름 또는 비밀번호가 올바르지 않습니다.";
    } else if (errorParam === "server_error") {
      errorMessage = "서버 오류가 발생했습니다. 다시 시도해주세요.";
    } else if (errorParam === "service_unavailable") {
      errorMessage = "인증 서비스가 사용 불가능합니다. 관리자에게 문의하세요.";
    }
  } catch (error) {
    console.error("URL parsing error:", error);
  }

  return (
    <div class="px-4 py-8 mx-auto fresh-gradient min-h-screen">
      <Head>
        <title>로그인 - Fresh</title>
      </Head>
      <div class="max-w-md mx-auto flex flex-col items-center justify-center min-h-screen">
        <div class="bg-white rounded-lg shadow-md p-8 w-full">
          <div class="text-center mb-8">
            <img
              class="mx-auto mb-4"
              src="/logo.svg"
              width="64"
              height="64"
              alt="Fresh logo"
            />
            <h1 class="text-2xl font-bold text-gray-900">로그인</h1>
            <p class="text-gray-600 mt-2">계정에 로그인하세요</p>
          </div>

          {errorMessage && (
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {errorMessage}
            </div>
          )}

          <form method="POST" action="/api/login" class="space-y-6">
            <div>
              <label
                for="username"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                사용자 이름
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="사용자 이름을 입력하세요"
              />
            </div>

            <div>
              <label
                for="password"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="비밀번호를 입력하세요"
              />
            </div>

            <button
              type="submit"
              class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
            >
              로그인
            </button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
              계정이 없으신가요?{" "}
              <a
                href="/register"
                class="text-blue-600 hover:text-blue-500 font-medium"
              >
                회원가입
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
