import React, { useState, useEffect } from "react";
import {
	Header,
	Panel,
	PanelHeader,
	PanelHeaderBack,
	Button,
	Div,
	Group,
	CellButton,
	Cell,
	Radio,
	FixedLayout,
	Spinner,
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import api from "../../../utils/api";
import ErrorPlaceholder from "../../../components/errorPlaceholder/errorPlaceholder";

const ImportPanel = (props) => {
	const [value, setValue] = useState("daylio");
	const [error, setError] = useState(null);
	const { userInfo } = props.state;
	const { importCount, setImportCount, snackbar } = props;

	useEffect(() => {
		const fetchImportCount = () => {
			api("GET", "/v1.1/vkApi/", {
				method: "storage.get",
				params: {
					user_id: userInfo.id,
					keys: "import",
				},
			})
				.then((res) => {
					if (res.data.error) throw res.data.error;
					if (res.data.response[0].value === "") setImportCount(2);
					else if (res.data.response[0].value === "#") setImportCount(0);
					else setImportCount(+res.data.response[0].value);
				})
				.catch((error) => {
					setError({ error: error, reload: fetchImportCount });
				});
		};
		fetchImportCount();
	}, [userInfo, setImportCount]);

	const onChange = (data) => {
		setValue(data.target.value);
	};

	const addAttempt = () => {
		api("GET", "/v1.1/vkApi/", {
			method: "storage.set",
			params: {
				user_id: userInfo.id,
				key: "import",
				value: importCount + 1,
			},
		})
			.then((res) => {
				if (res.data.error) throw res.data.error;
				setImportCount(importCount + 1);
			})
			.catch(() => {
				setError({ error: error, reload: addAttempt });
			});
	};

	var content = <Spinner size="large" />;

	if (error)
		content = (
			<ErrorPlaceholder
				error={error.error}
				action={
					<Button
						onClick={() => {
							setError(null);
							error.reload();
						}}
					>
						{" "}
						Попробовать снова{" "}
					</Button>
				}
			/>
		);
	else if (importCount !== null) {
		content = (
			<div>
				<Group header={<Header mode="secondary">Откуда импортировать</Header>}>
					<Radio name="import" value="daylio" defaultChecked onChange={onChange}>
						{" "}
						Daylio{" "}
					</Radio>
					<Radio name="import" value="pixels" onChange={onChange}>
						Pixels
					</Radio>
				</Group>
				<Group>
					<Cell indicator={importCount}>Осталось попыток импорта</Cell>
					{process.env.NODE_ENV === "development" ? (
						<CellButton onClick={addAttempt}>Добавить попытку импорта</CellButton>
					) : null}
				</Group>
				<div style={{ height: "70.4px" }} />
				{snackbar}
				<FixedLayout vertical="bottom">
					<Div style={{ background: "white" }}>
						<Button
							disabled={importCount === 0}
							size="xl"
							onClick={() => props.nav.goTo(props.storyId, value)}
						>
							{" "}
							Далее{" "}
						</Button>
					</Div>
				</FixedLayout>
			</div>
		);
	}

	return (
		<Panel id={props.id}>
			<PanelHeader
				separator={false}
				left={<PanelHeaderBack onClick={() => props.nav.goBack()} />}
			>
				Импорт
			</PanelHeader>
			{content}
		</Panel>
	);
};
export default ImportPanel;
