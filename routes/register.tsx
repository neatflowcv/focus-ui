import { define } from "../utils.ts";
import { Head } from "fresh/runtime";

export default define.page(function Register(ctx) {
  // URL 파라미터를 안전하게 가져오기
  let errorMessage = "";

  try {
    const url = new URL(ctx.req.url);
    const errorParam = url.searchParams.get("error");

    if (errorParam === "username_exists") {
      errorMessage = "이미 존재하는 사용자 이름입니다.";
    } else if (errorParam === "password_mismatch") {
      errorMessage = "비밀번호가 일치하지 않습니다.";
    } else if (errorParam === "server_error") {
      errorMessage = "서버 오류가 발생했습니다. 다시 시도해주세요.";
    } else if (errorParam === "service_unavailable") {
      errorMessage =
        "회원가입 서비스가 사용 불가능합니다. 관리자에게 문의하세요.";
    }
  } catch (error) {
    console.error("URL parsing error:", error);
  }

  return (
    <div class="px-4 py-8 mx-auto fresh-gradient min-h-screen">
      <Head>
        <title>회원가입 - Fresh</title>
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
            <h1 class="text-2xl font-bold text-gray-900">회원가입</h1>
            <p class="text-gray-600 mt-2">새 계정을 만드세요</p>
          </div>

          {errorMessage && (
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {errorMessage}
            </div>
          )}

          <form method="POST" action="/api/register" class="space-y-6">
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

            <div>
              <label
                for="confirmPassword"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                비밀번호 확인
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="비밀번호를 다시 입력하세요"
              />
            </div>

            <button
              type="submit"
              class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200"
            >
              회원가입
            </button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
              이미 계정이 있으신가요?{" "}
              <a
                href="/login"
                class="text-blue-600 hover:text-blue-500 font-medium"
              >
                로그인
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
