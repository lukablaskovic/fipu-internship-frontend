import createAxiosInstance from "@/helpers/axios-wrapper";
const AxiosWrapper = createAxiosInstance(import.meta.env.VITE_SENDGRID_API_URL);

const SendGrid = {
  async sendEmail(postData, to, template) {
    try {
      const url = `/email?to=${encodeURIComponent(
        to
      )}&template=${encodeURIComponent(template)}`;
      let result = await AxiosWrapper.post(url, postData);
      return result.data;
    } catch (e) {
      return null;
    }
  },
};

export { SendGrid };
