import CloseIcon from "@mui/icons-material/Close";

import styles from "../../styles/cabinet/PopupRemove.module.scss";

interface PopupRemoveProps {
	popupValue: (popupValue: number) => void;
}

export default function PopupRemove(props: PopupRemoveProps) {
	const { popupValue } = props;

	const popupClickHandler = (
		e: React.MouseEvent<HTMLElement>,
		value: number
	) => {
		e.preventDefault();
		popupValue(value);
	};

	return (
		<div className={styles.popupContainer}>
			<div className={styles.popupMessage}>
				Вы уверены, что хотите произвести удаление?
			</div>
			<div className={styles.btnsContainer}>
				<a
					href="#"
					className={`${styles.popupBtn} ${styles.popupBtnYes}`}
					onClick={(e) => popupClickHandler(e, 1)}
				>
					Да
				</a>
				<a
					href="#"
					className={`${styles.popupBtn} ${styles.popupBtnNo}`}
					onClick={(e) => popupClickHandler(e, 0)}
				>
					Нет
				</a>
			</div>
			<div
				className={styles.popupCloseBtn}
				onClick={(e) => popupClickHandler(e, 0)}
			>
				<CloseIcon />
			</div>
		</div>
	);
}
