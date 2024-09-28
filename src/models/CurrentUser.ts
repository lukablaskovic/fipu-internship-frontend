export interface InternshipProcess {
	id: number | null;
	pending_user_task: string | null;
}

export class CurrentUser {
	ime: string;
	prezime: string;
	JMBAG: string;
	email: string;
	godina_studija: string;
	avatar: string;
	model_prakse: string;
	baserow_id: string;
	loggedAt: Date | null;
	internship_process: InternshipProcess;

	constructor() {
		this.ime = "";
		this.prezime = "";
		this.JMBAG = "";
		this.email = "";
		this.godina_studija = "";
		this.avatar = "";
		this.model_prakse = "";
		this.baserow_id = "";
		this.loggedAt = null;
		this.internship_process = {
			id: null,
			pending_user_task: null,
		};
	}

	/**
	 * Resets all properties of the current user to their default values.
	 */
	reset(): void {
		this.ime = "";
		this.prezime = "";
		this.JMBAG = "";
		this.email = "";
		this.godina_studija = "";
		this.avatar = "";
		this.model_prakse = "";
		this.baserow_id = "";
		this.loggedAt = null;
		this.internship_process = {
			id: null,
			pending_user_task: null,
		};
	}

	/**
	 * Initializes the current user with data from an external source (e.g., API response).
	 * This function can be expanded based on how data is structured when fetched from the server.
	 *
	 * @param data - Partial object containing user data to initialize the current user.
	 */
	initializeFromData(data: Partial<CurrentUser>): void {
		this.ime = data.ime || "";
		this.prezime = data.prezime || "";
		this.JMBAG = data.JMBAG || "";
		this.email = data.email || "";
		this.godina_studija = data.godina_studija || "";
		this.avatar = data.avatar || "";
		this.model_prakse = data.model_prakse || "";
		this.baserow_id = data.baserow_id || "";
		this.loggedAt = data.loggedAt || null;

		this.internship_process = {
			id: data.internship_process?.id || null,
			pending_user_task: data.internship_process?.pending_user_task || null,
		};
	}

	/**
	 * Checks if the user has an active internship process.
	 *
	 * @returns {boolean} Whether the user has an active internship process or not.
	 */
	hasActiveInternship(): boolean {
		return this.internship_process.id !== null;
	}
}
