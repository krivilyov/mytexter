import { SubscriptionsData } from "../../../interfaces/interfaces";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";

import styles from "../../../styles/admin/MUITable.module.scss";

interface SubscriptionsListProps {
	subscriptions: SubscriptionsData[];
}

export default function SubscriptionsList(props: SubscriptionsListProps) {
	const { subscriptions } = props;
	const [pageSize, setPageSize] = useState(15);

	const columns: GridColDef[] = [
		{ field: "id", type: "number", headerName: "ID", flex: 1, align: "right" },
		{
			field: "email",
			headerName: "E-mail",
			flex: 3,
			align: "left",
		},
	];

	return (
		<>
			<DataGrid
				rows={subscriptions}
				columns={columns}
				pageSize={pageSize}
				onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
				rowsPerPageOptions={[15, 25, 50]}
				pagination
				className={styles.root}
			/>
		</>
	);
}
