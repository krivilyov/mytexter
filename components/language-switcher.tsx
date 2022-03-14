import Link from "next/link";
import { useRouter } from "next/router";

import styles from "../styles/LanguageSwitcher.module.scss";

export default function LanguageSwitcher() {
  const router = useRouter();

  return (
    <ul className={styles.switcher}>
      {router.locales?.map((locale) => (
        <li
          key={locale}
          className={`${styles.switcherItem} ${
            router.locale === locale ? styles.active : ""
          }`}
        >
          <Link href={router.asPath} locale={locale}>
            <a>{locale}</a>
          </Link>
        </li>
      ))}
    </ul>
  );
}
