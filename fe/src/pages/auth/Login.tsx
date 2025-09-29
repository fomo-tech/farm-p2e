import { notification } from "antd";
import requestService from "api/request";
import logo from "assets/images/logo.png";
import TurnstileCaptcha from "components/ui/TurnstileCaptcha";
import { getJSONFromUrl, getRecaptchaToken } from "lib/helpers";
import { socket } from "lib/socket";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuthApp } from "store/useAuthApp";
import { useGlobalAppStore } from "store/useGlobalApp";

interface IFormInput {
  phone: string;
  password: string;
}

const Login = () => {
  const { onSetUser } = useAuthApp();
  const { loading, handleCallbackUser, handleLoading } = useGlobalAppStore();
  const [turnstileToken, setTurnstileToken] = useState("");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<IFormInput>({});
  const { r } = getJSONFromUrl();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    handleLoading(true);
    try {
      // const token = await getRecaptchaToken();
      const res = await requestService.post("/auth/login", {
        data: {
          ...data,
          recaptchaToken: turnstileToken,
        },
      });
      if (res && res.data) {
        localStorage.setItem(
          "accessToken",
          res?.data?.data?.tokens?.accessToken
        );
        localStorage.setItem(
          "refreshToken",
          res?.data?.data?.tokens?.refreshToken
        );
        onSetUser(res?.data?.data?.user);
        socket.emit("joinApp", res?.data?.data?.user._id);
        // message.success(res?.data?.message)
        handleLoading(false);
        setTimeout(() => {
          handleLoading(false);
          navigate("/", { replace: true });
        }, 500);
      }
    } catch (error: any) {
      console.log("====================================");
      console.log(error?.response);
      console.log("====================================");
      notification.error({
        message: error?.response?.data?.message,
        duration: 3,
      });
      handleLoading(false);
    }
  };

  return (
    <div data-v-544b5ac9="" data-v-daf86cc3="" className="login-content">
      <div
        data-v-544b5ac9=""
        className="login-image !m-[3rem]  flex justify-center"
      >
        <img
          data-v-544b5ac9=""
          src={logo}
          alt="Login"
          className="!size-[40rem]"
        />
      </div>
      <form
        data-v-544b5ac9=""
        className="login-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div data-v-544b5ac9="" className="form-item">
          <div data-v-544b5ac9="" className="van-cell van-field">
            {/* <div className="van-field__left-icon">
              <div data-v-544b5ac9="" className="country-code">
                +84
              </div>
            </div> */}
            {/**/}
            <div className="van-cell__value van-field__value">
              <div className="van-field__body">
                <input
                  type="text"
                  id="van-field-5-input"
                  {...register("phone", {
                    required: t("auth.username_required"),
                    pattern: {
                      value: /^[a-z0-9_]{6,20}$/,
                      message: t("auth.invalid_username_format"),
                    },
                  })}
                  className="van-field__control van-field__control !border-[0px] p-4"
                  placeholder={t("Nhập tên tài khoản")}
                  autoComplete="off"
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.value = target.value.toLowerCase();
                  }}
                />
              </div>
            </div>
          </div>
          {errors.phone && (
            <p className="pl-2 text-red-600 text-[2.5rem]">
              {errors.phone.message}
            </p>
          )}
        </div>
        <div data-v-544b5ac9="" className="form-item">
          <div data-v-544b5ac9="" className="van-cell van-field">
            <div className="van-field__left-icon">
              <i className="van-badge__wrapper van-icon van-icon-shield-o"></i>
            </div>
            {/**/}
            <div className="van-cell__value van-field__value">
              <div className="van-field__body">
                <input
                  type="password"
                  id="van-field-6-input"
                  {...register("password", {
                    required: t("auth.password_required"),
                  })}
                  className="van-field__control van-field__control !border-[0px] p-4"
                  placeholder={t("auth.password")}
                  autoComplete="current-password"
                  data-allow-mismatch="attribute"
                />
                {/**/}
                <div className="van-field__right-icon">
                  <i className="van-badge__wrapper van-icon van-icon-closed-eye">
                    {/**/}
                    {/**/}
                    {/**/}
                  </i>
                </div>
                {/**/}
              </div>
              {/**/}
              {/**/}
            </div>
            {/**/}
            {/**/}
          </div>
          {errors.password && (
            <p className="pl-2 text-red-600 text-[2.5rem]">
              {errors.password.message}
            </p>
          )}
        </div>
        <div data-v-544b5ac9="" className="form-item">
          {t("Bạn chưa có tài khoản")} ?{" "}
          <span
            className="font-[700] cursor-pointer text-[#733e39]"
            onClick={() => navigate(r ? `/register?r=${r}` : "/register")}
          >
            {t("Đăng kí ngay")}
          </span>
        </div>
        {/**/}
        <TurnstileCaptcha onToken={setTurnstileToken} key="login-turnstile" />
        <div data-v-544b5ac9="" className="submit-btn">
          <button
            data-v-544b5ac9=""
            type="submit"
            className="w-full rounded-[20px] text-[#fff] van-button van-button--primary van-button--normal van-button--block van-button--round van-button--disabled"
          >
            <div className="van-button__content">
              {/**/}
              <span className="van-button__text">{t("auth.login")}</span>
              {/**/}
            </div>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
