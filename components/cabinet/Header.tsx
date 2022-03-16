import Image from "next/image";
import { UserDocument } from "../../interfaces/interfaces";

import styles from "../../styles/cabinet/Header.module.scss";

interface HeaderProps {
  user: UserDocument;
}

export default function Header(props: HeaderProps) {
  const { user } = props;

  return (
    <div className={styles.header}>
      <div className={styles.userInfo}>
        <div className={styles.avatar}>
          <Image
            src={
              user.avatar
                ? `${process.env.NEXT_PUBLIC_API_URL}/${user.avatar}`
                : "/images/empty_avatar.jpg"
            }
            alt="Avatar logo"
            width={80}
            height={80}
          />
        </div>
        <div className={styles.userDescription}>
          <div className={styles.userName}>{user.name}</div>
        </div>
      </div>
    </div>
  );
}
