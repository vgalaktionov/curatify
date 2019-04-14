import app from "../../server/server";
import request from "supertest";

describe("Auth", () => {
  test("should redirect on /auth/login", async () => {
    await request(app)
      .get("/auth/login")
      .expect("Location", /^https:\/\/accounts\.spotify\.com\/login\?.*/)
      .redirects(1);
  });
});
