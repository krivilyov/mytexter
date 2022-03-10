import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";

import styles from "../../styles/auth/RegSuccessPage.module.scss";

export default function RestoreSuccessful() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>Restore password</title>
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
              {t("auth:text-restore-success")}
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
