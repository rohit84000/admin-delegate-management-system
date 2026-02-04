import client from "../api/client";

export const logout = async (redirectUrl = "/") => {
  try {
    await client.post("/logout");
  } catch (e) {
    // ignore error (token may already be invalid)
  } finally {
    localStorage.removeItem("token");
    window.location.href = redirectUrl;
  }
};
