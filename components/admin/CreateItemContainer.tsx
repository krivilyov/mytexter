import styles from "../../styles/admin/CreateItemContainer.module.scss";
import Link from "next/link";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

type CreateItemContainerProps = {
	link: string;
	btnName: string;
};

const CreateItemContainer = (props: CreateItemContainerProps) => {
	const { link, btnName } = props;

	return (
		<div className={styles.createItemContainer}>
			<Link href={link}>
				<Button variant="contained" color="success" startIcon={<AddIcon />}>
					{btnName}
				</Button>
			</Link>
		</div>
	);
};

export default CreateItemContainer;
