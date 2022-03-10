import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import Input from "../../components/input";
import Loader from "../../components/loader";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";

import styles from "../../styles/auth/Restore.module.scss";

export default function Restore() {
  const { t } = useTranslation();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loader, isLoader] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validate = formValidate();

    if (validate) {
      //loader
      isLoader(true);

      axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/restore`,
          {
            email: email,
          },
          { withCredentials: true }
        )
        .then((res) => {
          isLoader(false);
          router.push("/auth/restore-success");
        })
        .catch((error) => {
          if (error.response) {
            handleErrorForm(error.response.data);
          }
        });
    }
  };

  interface Errors {
    email: string;
  }

  const handleErrorForm = (errors: Errors) => {
    isLoader(false);
    if (errors.email) {
      setEmailError(errors.email);
    }
  };

  const formValidate = (): boolean => {
    let validateEmail = true;

    //for email
    const filterEmail =
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!filterEmail.test(String(email).toLowerCase())) {
      validateEmail = false;
      setEmailError(t("auth:wrong-email"));
    } else setEmailError("");

    if (validateEmail) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <Head>
        <title>Restore password page</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <Link href="/">
            <a className={styles.logoLink}>
              <Image
                src="/images/logo.svg"
                alt="My Texter logo"
                width={250}
                height={90}
              />
            </a>
          </Link>
          <div className={styles.heroText}>{t("auth:hero-text-restore")}</div>
          <div className={styles.formWrap}>
            <form onSubmit={handleFormSubmit}>
              <div className={styles.formGroup}>
                <Input
                  type="text"
                  id="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  loader={loader}
                  placeholder="Email"
                  autocomplete="off"
                />

                <button
                  className={styles.formButton}
                  type="submit"
                  disabled={loader ? true : false}
                >
                  {!loader ? (
                    "Ок"
                  ) : (
                    <div className={styles.loaderContainer}>
                      <Loader image="/images/loader.svg" />
                    </div>
                  )}
                </button>
              </div>
              {emailError && (
                <div className={styles.errorItem}>{emailError}</div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
