export function persistSession(keys: string[], key?: string) {
	return {
		key,
		storage: sessionStorage,
		paths: keys,
		serializer: {
			serialize: JSON.stringify,
			deserialize(value: string) {
				// Persistedstate v3 applies paths only when saving, so filter older snapshots on restore too.
				const state = JSON.parse(value);
				return Object.fromEntries(keys.filter((key) => Object.prototype.hasOwnProperty.call(state, key)).map((key) => [key, state[key]]));
			},
		},
	};
}
