import createAxiosInstance from "@/helpers/axios-wrapper";
const AxiosWrapper = createAxiosInstance(import.meta.env.VITE_GATEWAY_API_URL);

const Auth = {
    async register(postData) {
        try {
            let result = await AxiosWrapper.post("/students", postData);
            return result;
        } catch (error) {
            return error;
        }
    },
    async update_process_instance(student_id, process_instance_id) {
        try {
            let result = await AxiosWrapper.patch(
                `/students/${student_id}/process-instance`,
                { process_instance_id: process_instance_id }
            );
            console.log(result);
            return result;
        } catch (error) {
            return error;
        }
    },
    async login(userData) {
        try {
            let result = await AxiosWrapper.post("/auth", userData);
            return result;
        } catch (error) {
            if (error.response && error.response.status === 403) {
                return error;
            }
            return error;
        }
    },
};

const User = {
    async getCurrentUser() {
        try {
            let result = await AxiosWrapper.get("/users/me");
            return result;
        } catch (e) {
            return null;
        }
    },
    async updatePassword(updates, retries = 3) {
        while (retries > 0) {
            try {
                let result = await AxiosWrapper.patch(`/users/update_password`, updates);
                return result;
            } catch (error) {
            if (retries === 1) {
                console.error(`Failed to update password after multiple attempts:`, error);
                return null;
            }
            retries--;
            }
        }
    },
    async getStudents(retries = 3) {
        while (retries > 0) {
            try {
                let result = await AxiosWrapper.get("/admin/students");
                if (!result || result.length === 0) {
                    throw new Error("Nema pronađenih studenata.");
                }
                return result;
            } catch (error) {
                if (retries === 1) {
                    console.error(
                        "Nije uspjelo dohvaćanje studenata nakon više ponovljenih pokušaja:",
                        error
                    );
                    return null;
                }
                retries--;
            }
        }
    },
    async getAllAdmins(retries = 3) {
        while (retries > 0) {
            try {
                let result = await AxiosWrapper.get("/users/get_all_admins_info");
                return result;
            } catch (error) {
                if (retries === 1) {
                    console.error("Failed to fetch admins after multiple attempts:", error);
                    return null;
                }
                retries--;
            }
        }
    },

    async getAllUsers(retries = 3) {
        while (retries > 0) {
            try {
                let result = await AxiosWrapper.get("/users/get_all_users_info");
                return result;
            } catch (error) {
                if (retries === 1) {
                    console.error("Failed to fetch users after multiple attempts:", error);
                    return null;
                }
                retries--;
            }
        }
    },

    async getMessages(receiver_id, retries = 3) {
        while (retries > 0) {
            try {
                let result = await AxiosWrapper.get(`/users/get_messages/${receiver_id}`);
                return result;
            } catch (error) {
                if (retries === 1) {
                    console.error("Failed to fetch messages after multiple attempts:", error);
                    return null;
                }
                retries--;
            }
        }
    },

    async getLastMessage(receiver_id, retries = 3) {
        while (retries > 0) {
            try {
                let result = await AxiosWrapper.get(`/users/get_last_message/${receiver_id}`);
                return result;
            } catch (error) {
                if (retries === 1) {
                    console.error("Failed to fetch messages after multiple attempts:", error);
                    return null;
                }
                retries--;
            }
        }
    },

    async sendMessage(message, retries = 3) {
        while (retries > 0) {
            try {
                let result = await AxiosWrapper.post("/users/send_message", message);
                return result;
            } catch (error) {
                if (retries === 1) {
                    console.error("Failed to send message after multiple attempts:", error);
                    return null;
                }
                retries--;
            }
        }
    },

    async addConversation(conversation, retries = 3) {
        while (retries > 0) {
            try {
            let result = await AxiosWrapper.post("/users/add_conversation", conversation);
            return result.data;
            } catch (error) {
            if (retries === 1) {
                console.error("Failed to add conversation after multiple attempts:", error);
                return null;
            }
            retries--;
            }
        }
    },

    async getConversations(userId, retries = 3) {
        while (retries > 0) {
            try {
                let result = await AxiosWrapper.get(`/users/get_conversations/${userId}`);
                return result;
            } catch (error) {
                if (retries === 1) {
                    console.error("Failed to fetch conversations after multiple attempts:", error);
                    return null;
                }
                retries--;
            }
        }
    },

    async updateConversation(conversationId, updates, retries = 3) {
        while (retries > 0) {
            try {
            let result = await AxiosWrapper.patch(`/users/update_conversation/${conversationId}`, updates);
            return result.data;
            } catch (error) {
            if (retries === 1) {
                console.error(`Failed to update conversation ${conversationId} after multiple attempts:`, error);
                return null;
            }
            retries--;
            }
        }
    }

}

export { Auth, User };
