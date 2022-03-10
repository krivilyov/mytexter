import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { UserDocument } from "../../interfaces/interfaces";
import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";

import styles from "../../styles/auth/RegSuccessPage.module.scss";

type RegistrationSuccessfulProps = {
  user: UserDocument;
};

export default function RegistrationSuccessful(
  props: RegistrationSuccessfulProps
) {
  const { t } = useTranslation();
  const { user } = props;

  return (
    <>
      <Head>
        <title>Success registration page</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.infoBg}>
            <div className={styles.logoContainer}>
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
            </div>
            <div className={styles.description}>
              <Trans
                i18nKey="auth:registration-success-description-with-html"
                components={[
                  <span className={styles.bold}></span>,
                  <span className={styles.bold}>{user.email}</span>,
                ]}
              />
            </div>
            <div className={styles.linkContainer}>
              <Link href="/">
                <a>{t("auth:to-index-btn")}</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

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

  if (!user || user.isActive) {
    return {
      redirect: {
        destination: "/",
        statusCode: 302,
      },
    };
  }

  return {
    props: {
      user: user,
    },
  };
};
