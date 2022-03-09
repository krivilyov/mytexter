import type { NextPage } from "next";
import { useState } from "react";
import { GetServerSideProps } from "next";
import Input from "../../components/input";
import axios from "axios";
import { useRouter } from "next/router";
import { errors } from "../../lib/messages";
import Image from "next/image";
import Link from "next/link";
import Loader from "../../components/loader";
import useTranslation from "next-translate/useTranslation";

import styles from "../../styles/auth/AuthForm.module.scss";

const Registration: NextPage = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value.trim() });
  };

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loader, isLoader] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validate = formValidate();

    if (validate) {
      //loader
      isLoader(true);

      axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/registration`,
          {
            name: values.name,
            email: values.email,
            password: values.password,
          },
          { withCredentials: true }
        )
        .then((res) => {
          isLoader(false);
          router.push("/auth/registration-successful");
        })
        .catch((error) => {
          if (error.response) {
            handleErrorForm(error.response.data);
          }
        });
    }
  };

  const formValidate = (): boolean => {
    let validateName = true;
    let validateEmail = true;
    let validatePassword = true;

    //name
    const filterName = /[a-zA-Zа-яА-ЯёЁ0-9-_\.]{3,20}$/;
    if (!filterName.test(String(values.name).toLowerCase())) {
      validateName = false;
      setNameError(t("auth:wrong-name"));
    } else setNameError("");

    //email
    const filterEmail =
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!filterEmail.test(String(values.email).toLowerCase())) {
      validateEmail = false;
      setEmailError(t("auth:wrong-email"));
    } else setEmailError("");

    //password
    const filterPassword =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,12}$/;
    if (!filterPassword.test(String(values.password).toLowerCase())) {
      validatePassword = false;
      setPasswordError(t("auth:wrong-password"));
    } else setPasswordError("");

    if (validateName && validateEmail && validatePassword) {
      return true;
    } else {
      return false;
    }
  };

  interface Errors {
    name: string;
    email: string;
    password: string;
  }

  const handleErrorForm = (errors: Errors) => {
    isLoader(false);

    if (errors.name) {
      setNameError(errors.name);
    }

    if (errors.email) {
      setEmailError(errors.email);
    }

    if (errors.password) {
      setPasswordError(errors.password);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.heroContainer}>
          <div className={styles.logoContainer}>
            <Link href="/">
              <a className={styles.logoLink}>
                <Image
                  src="/images/logo.svg"
                  alt="My Texter logo"
                  width={300}
                  height={107}
                />
              </a>
            </Link>
          </div>
          <div className={styles.heroText}>{t("auth:hero-text-reg")}</div>
        </div>
        <div className={styles.formWrap}>
          <form className={styles.form} onSubmit={handleFormSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="email">
                {t("auth:label-name")}
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                value={values.name}
                onChange={onChange}
                loader={loader}
                error={!!nameError}
              />
              {nameError && <div className={styles.errorItem}>{nameError}</div>}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="email">
                {t("auth:label-email")}
              </label>
              <Input
                type="text"
                id="email"
                name="email"
                value={values.email}
                onChange={onChange}
                loader={loader}
                error={!!emailError}
              />
              {emailError && (
                <div className={styles.errorItem}>{emailError}</div>
              )}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="password">
                {t("auth:label-password")}
              </label>
              <Input
                type="password"
                id="password"
                name="password"
                value={values.password}
                onChange={onChange}
                loader={loader}
                error={!!passwordError}
              />
              {passwordError && (
                <div className={styles.errorItem}>{passwordError}</div>
              )}
            </div>

            <div className={styles.separator}></div>

            <button
              className={styles.formButton}
              type="submit"
              disabled={loader ? true : false}
            >
              {!loader ? (
                t("auth:registrate")
              ) : (
                <div className={styles.loaderContainer}>
                  <Loader image="/images/loader.svg" />
                </div>
              )}
            </button>
          </form>
        </div>
        <div className={styles.loginLinkContainer}>
          {t("auth:exist-account")}
          <Link href="/auth/login">
            <a className={styles.recover}>{t("auth:form-button")}</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Registration;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.cookies.token || "";
  let user = null;

  if (token) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.ok) {
      user = await res.json();
    }
  }

  if (user) {
    return {
      redirect: {
        destination: "/",
        statusCode: 302,
      },
    };
  }

  return {
    props: {},
  };
};
