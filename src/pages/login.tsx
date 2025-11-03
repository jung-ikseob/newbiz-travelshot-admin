import GradientBg from "@/components/page/login/gradient-bg";
import LoginForm from "@/components/page/login/login-form";
import { Alert } from "antd";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen bg-white items-centerw-full">
      <div className={`relative hidden w-1/2 lg:flex lg:items-center lg:justify-center`}>
        <GradientBg className="absolute top-0 left-0 w-full h-full" />
        <img src="/images/travelshot-logo.png" className="relative z-10 w-auto h-auto max-w-md" alt="Travel Shot Logo" />
      </div>

      <div className="w-full lg:w-1/2">
        <div className="relative flex items-center justify-center h-full">
          <section className="w-full px-5 pb-10 text-gray-800 sm:w-4/6 md:w-3/6 lg:w-4/6 xl:w-3/6 sm:px-0">
            {!process.env.NEXT_PUBLIC_API_ENDPOINT ? (
              <Alert
                message="환경변수 설정 오류"
                description={
                  <span>
                    .env.example 파일을 복사하여 .env 파일을 생성해주세요.{" "}
                    <a
                      href="https://github.com/purpleio/purple-admin-ui#%EA%B8%B0%EB%B3%B8-%EC%84%A4%EC%A0%95"
                      target="_blank"
                      rel="noreferrer"
                    >
                      참고 링크
                    </a>
                  </span>
                }
                type="error"
                showIcon
                className="my-10"
              />
            ) : null}
            <div className="flex flex-col items-center justify-center px-2 mt-8 sm:mt-0">
              <h2 className="mt-2 text-5xl font-bold leading-tight inter">K-ID</h2>
              <div className="mt-1 text-lg text-gray-400">Admin System</div>
            </div>

            <div className="w-full px-2 mt-12 sm:px-6">
              <LoginForm />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
