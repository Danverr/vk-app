import { useState } from "react";
import bridge from "@vkontakte/vk-bridge";

const useVkStorage = (defaultValues) => {
	const [values, setValues] = useState(null);
	const keys = Object.keys(defaultValues);

	const fetchValues = async () => {
		const newValues = {};
		const res = await bridge.send("VKWebAppStorageGet", { keys: keys });

		if (res.keys) {
			for (const item of res.keys) {
				const { key, value } = item;

				// eslint-disable-next-line
				if (value == false) newValues[key] = defaultValues[key];
				else if (value === "false") newValues[key] = false;
				else if (value === "true") newValues[key] = true;
				else newValues[key] = value;
			}
		} else {
			for (const key of keys) {
				newValues[key] = null;
			}
		}

		setValues(newValues);
	};

	const setValue = (key, value) => {
		bridge.send("VKWebAppStorageSet", { key: key, value: "" + value });

		let newValues = { ...values };

		// eslint-disable-next-line
		if ("" + value == false) newValues[key] = defaultValues[key];
		else newValues[key] = value;

		setValues(newValues);
	};

	const clear = () => {
		for (const key in values) {
			bridge.send("VKWebAppStorageSet", { key: key, value: "" });
		}

		setValues(defaultValues);
	};

	console.log("VK Storage: ", values);

	return {
		fetchValues: fetchValues,
		getValue: (key) => values[key],
		setValue: setValue,
		clear: clear,
	};
};

export default useVkStorage;
